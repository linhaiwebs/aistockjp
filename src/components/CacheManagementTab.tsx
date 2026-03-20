import { useState, useEffect } from 'react';
import { Trash2, RefreshCw, Database, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { apiClient } from '../lib/apiClient';

interface CacheStats {
  totalEntries: number;
  expiredEntries: number;
  activeEntries: number;
  totalHits: number;
}

interface CacheEntry {
  stock_code: string;
  created_at: string;
  expires_at: string;
  hit_count: number;
  last_hit_at: string | null;
  model_used: string;
  is_active: number;
}

export default function CacheManagementTab() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [entries, setEntries] = useState<CacheEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCacheData = async () => {
    try {
      setLoading(true);
      const [statsRes, entriesRes] = await Promise.all([
        apiClient.get('/api/admin/cache/stats'),
        apiClient.get('/api/admin/cache/entries')
      ]);

      if (statsRes.ok && entriesRes.ok) {
        const statsData = await statsRes.json();
        const entriesData = await entriesRes.json();

        setStats(statsData.stats);
        setEntries(entriesData.entries);
      }
    } catch (error) {
      console.error('Failed to fetch cache data:', error);
      showMessage('error', 'キャッシュデータの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCacheData();
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleClearAll = async () => {
    if (!confirm('すべてのキャッシュを削除してもよろしいですか？')) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await apiClient.delete('/api/admin/cache/clear-all');

      if (response.ok) {
        const data = await response.json();
        showMessage('success', data.message);
        await fetchCacheData();
      } else {
        showMessage('error', 'キャッシュの削除に失敗しました');
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
      showMessage('error', 'キャッシュの削除中にエラーが発生しました');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCleanExpired = async () => {
    try {
      setActionLoading(true);
      const response = await apiClient.post('/api/admin/cache/clean-expired', {});

      if (response.ok) {
        const data = await response.json();
        showMessage('success', data.message);
        await fetchCacheData();
      } else {
        showMessage('error', '期限切れキャッシュの削除に失敗しました');
      }
    } catch (error) {
      console.error('Failed to clean expired cache:', error);
      showMessage('error', 'キャッシュのクリーン中にエラーが発生しました');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearByStock = async (stockCode: string) => {
    if (!confirm(`株式コード ${stockCode} のキャッシュを削除してもよろしいですか？`)) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await apiClient.delete(`/api/admin/cache/clear/${stockCode}`);

      if (response.ok) {
        const data = await response.json();
        showMessage('success', data.message);
        await fetchCacheData();
      } else {
        showMessage('error', 'キャッシュの削除に失敗しました');
      }
    } catch (error) {
      console.error('Failed to clear cache by stock:', error);
      showMessage('error', 'キャッシュの削除中にエラーが発生しました');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  const getExpiryStatus = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const hoursRemaining = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursRemaining <= 0) {
      return { text: '期限切れ', color: 'text-red-600', bgColor: 'bg-red-100' };
    } else if (hoursRemaining < 1) {
      return { text: `残り${Math.round(hoursRemaining * 60)}分`, color: 'text-orange-600', bgColor: 'bg-orange-100' };
    } else {
      return { text: `残り${Math.round(hoursRemaining)}時間`, color: 'text-green-600', bgColor: 'bg-green-100' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">総エントリー数</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalEntries || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">有効なキャッシュ</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeEntries || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">期限切れ</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.expiredEntries || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">総ヒット数</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalHits || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">キャッシュ管理</h3>
          <div className="flex gap-2">
            <button
              onClick={handleCleanExpired}
              disabled={actionLoading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
              期限切れを削除
            </button>
            <button
              onClick={handleClearAll}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              すべて削除
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">株式コード</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">作成日時</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">有効期限</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">状態</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ヒット数</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">モデル</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    キャッシュエントリーがありません
                  </td>
                </tr>
              ) : (
                entries.map((entry) => {
                  const status = getExpiryStatus(entry.expires_at);
                  return (
                    <tr key={`${entry.stock_code}-${entry.created_at}`} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{entry.stock_code}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatDate(entry.created_at)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatDate(entry.expires_at)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color} ${status.bgColor}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{entry.hit_count}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{entry.model_used}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleClearByStock(entry.stock_code)}
                          disabled={actionLoading}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">キャッシュについて</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• キャッシュの有効期限は6時間です</li>
          <li>• 同じ株式コードの診断は、有効期限内であればキャッシュから返されます</li>
          <li>• 期限切れのキャッシュは自動的に1時間ごとに削除されます</li>
          <li>• 株式データが更新された場合は、手動でキャッシュを削除してください</li>
        </ul>
      </div>
    </div>
  );
}
