import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, copyFileSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbDir = join(__dirname, '..', 'data');
const backupDir = join(dbDir, 'backups');
const dbPath = join(dbDir, 'database.db');

if (!existsSync(backupDir)) {
  mkdirSync(backupDir, { recursive: true });
}

export function createBackup() {
  try {
    if (!existsSync(dbPath)) {
      console.log('⚠️  Database file does not exist, skipping backup');
      return null;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupPath = join(backupDir, `database-${timestamp}.db`);

    const db = new Database(dbPath);
    db.backup(backupPath).then(() => {
      db.close();
      console.log(`✅ Database backup created: ${backupPath}`);
      cleanOldBackups();
    }).catch(err => {
      console.error('❌ Backup failed:', err);
      db.close();
    });

    return backupPath;
  } catch (error) {
    console.error('❌ Error creating backup:', error.message);
    return null;
  }
}

export function cleanOldBackups(keepCount = 5) {
  try {
    if (!existsSync(backupDir)) {
      return;
    }

    const backups = readdirSync(backupDir)
      .filter(file => file.startsWith('database-') && file.endsWith('.db'))
      .map(file => ({
        name: file,
        path: join(backupDir, file),
        time: new Date(file.replace('database-', '').replace('.db', '').replace(/-/g, ':'))
      }))
      .sort((a, b) => b.time - a.time);

    if (backups.length > keepCount) {
      const toDelete = backups.slice(keepCount);
      toDelete.forEach(backup => {
        try {
          unlinkSync(backup.path);
          console.log(`🗑️  Deleted old backup: ${backup.name}`);
        } catch (err) {
          console.error(`❌ Failed to delete backup ${backup.name}:`, err.message);
        }
      });
    }
  } catch (error) {
    console.error('❌ Error cleaning old backups:', error.message);
  }
}

export function restoreBackup(backupFileName) {
  try {
    const backupPath = join(backupDir, backupFileName);

    if (!existsSync(backupPath)) {
      console.error('❌ Backup file not found:', backupPath);
      return false;
    }

    const tempPath = dbPath + '.tmp';
    copyFileSync(dbPath, tempPath);

    try {
      copyFileSync(backupPath, dbPath);
      unlinkSync(tempPath);
      console.log(`✅ Database restored from backup: ${backupFileName}`);
      return true;
    } catch (error) {
      copyFileSync(tempPath, dbPath);
      unlinkSync(tempPath);
      throw error;
    }
  } catch (error) {
    console.error('❌ Error restoring backup:', error.message);
    return false;
  }
}

export function listBackups() {
  try {
    if (!existsSync(backupDir)) {
      return [];
    }

    return readdirSync(backupDir)
      .filter(file => file.startsWith('database-') && file.endsWith('.db'))
      .map(file => ({
        name: file,
        path: join(backupDir, file),
        time: new Date(file.replace('database-', '').replace('.db', '').replace(/-/g, ':'))
      }))
      .sort((a, b) => b.time - a.time);
  } catch (error) {
    console.error('❌ Error listing backups:', error.message);
    return [];
  }
}
