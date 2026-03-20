import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../database/sqlite.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';
import { getSessionSummary, getPopularStocks, getAllSessions, getEventsBySessionId } from '../database/sqliteHelpers.js';
import { createBackup, listBackups, restoreBackup } from '../utils/databaseBackup.js';
import { getCacheStats, clearAllCache, clearCacheByStockCode, cleanExpiredCache, getAllCacheEntries } from '../utils/sqliteCache.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = db.prepare(`
      SELECT * FROM admin_users WHERE username = ?
    `).get(username);

    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    db.prepare(`
      UPDATE admin_users
      SET last_login_at = ?
      WHERE id = ?
    `).run(new Date().toISOString(), user.id);

    const token = generateToken(user.id, user.username);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '登录失败,请重试' });
  }
});

router.post('/logout', authMiddleware, (req, res) => {
  res.json({ success: true });
});

router.get('/verify', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const { days = 7, limit = 50, offset = 0 } = req.query;
    const daysBack = parseInt(days);
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    const { sessions, count } = getAllSessions(limitNum, offsetNum, daysBack);

    const sessionsWithEvents = sessions.map(session => ({
      ...session,
      events: getEventsBySessionId(session.session_id)
    }));

    res.json({
      sessions: sessionsWithEvents,
      total: count,
      limit: limitNum,
      offset: offsetNum
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const daysBack = parseInt(days);

    const summary = getSessionSummary(daysBack);
    const popularStocks = getPopularStocks(daysBack, 10);

    res.json({
      summary,
      popularStocks
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

router.post('/backup/create', authMiddleware, async (req, res) => {
  try {
    const backupPath = createBackup();
    if (backupPath) {
      res.json({ success: true, message: 'Backup created successfully', path: backupPath });
    } else {
      res.status(500).json({ error: 'Failed to create backup' });
    }
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

router.get('/backup/list', authMiddleware, async (req, res) => {
  try {
    const backups = listBackups();
    res.json({ backups });
  } catch (error) {
    console.error('Error listing backups:', error);
    res.status(500).json({ error: 'Failed to list backups' });
  }
});

router.post('/backup/restore', authMiddleware, async (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    const success = restoreBackup(filename);
    if (success) {
      res.json({ success: true, message: 'Database restored successfully' });
    } else {
      res.status(500).json({ error: 'Failed to restore backup' });
    }
  } catch (error) {
    console.error('Error restoring backup:', error);
    res.status(500).json({ error: 'Failed to restore backup' });
  }
});

router.get('/cache/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await getCacheStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching cache stats:', error);
    res.status(500).json({ error: 'Failed to fetch cache statistics' });
  }
});

router.get('/cache/entries', authMiddleware, async (req, res) => {
  try {
    const entries = await getAllCacheEntries();
    res.json({ success: true, entries });
  } catch (error) {
    console.error('Error fetching cache entries:', error);
    res.status(500).json({ error: 'Failed to fetch cache entries' });
  }
});

router.delete('/cache/clear-all', authMiddleware, async (req, res) => {
  try {
    const deletedCount = await clearAllCache();
    res.json({ success: true, message: `Cleared ${deletedCount} cache entries`, deletedCount });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

router.delete('/cache/clear/:stockCode', authMiddleware, async (req, res) => {
  try {
    const { stockCode } = req.params;
    if (!stockCode) {
      return res.status(400).json({ error: 'Stock code is required' });
    }

    const deletedCount = await clearCacheByStockCode(stockCode);
    res.json({ success: true, message: `Cleared ${deletedCount} cache entries for stock ${stockCode}`, deletedCount });
  } catch (error) {
    console.error('Error clearing cache by stock code:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

router.post('/cache/clean-expired', authMiddleware, async (req, res) => {
  try {
    const deletedCount = await cleanExpiredCache();
    res.json({ success: true, message: `Cleaned ${deletedCount} expired cache entries`, deletedCount });
  } catch (error) {
    console.error('Error cleaning expired cache:', error);
    res.status(500).json({ error: 'Failed to clean expired cache' });
  }
});

export default router;
