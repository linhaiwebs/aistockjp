import { X, ExternalLink, Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import AnalysisRenderer from './AnalysisRenderer';
import AIAccuracyChart from './AIAccuracyChart';

interface DiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: string;
  stockCode: string;
  stockName: string;
  onLineConversion: () => void;
  onReportDownload: () => void;
  isStreaming?: boolean;
  isConnecting?: boolean;
}

export default function DiagnosisModal({
  isOpen,
  onClose,
  analysis,
  stockCode,
  stockName,
  onLineConversion,
  onReportDownload,
  isStreaming = false,
  isConnecting = false,
}: DiagnosisModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset scroll position to top when modal opens
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('data-modal-open', 'true');

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.removeAttribute('data-modal-open');
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-80" style={{ touchAction: 'none' }}>
      <div className="relative w-full max-w-3xl max-h-[90vh]">
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ touchAction: 'auto' }}>
          <div
            className="sticky top-0 px-2 py-2 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1321 100%)' }}
          >
          <div className="flex-1 text-center">
            <h2 className="text-sm font-bold text-white">
              {stockName}（{stockCode}）AI分析レポート
            </h2>
            {isConnecting && (
              <div className="flex items-center gap-2 text-white text-sm justify-center mt-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AIサーバーに接続中...</span>
              </div>
            )}
            {isStreaming && !isConnecting && (
              <div className="flex items-center gap-2 text-white text-sm justify-center mt-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>レポート生成中...</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors ml-4 hover:bg-white/20"
            aria-label="閉じる"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div ref={contentRef} className="overflow-y-auto max-h-[calc(90vh-180px)] px-2 py-2">
          <div className="mb-6">

            <div className="rounded-xl p-2 shadow-inner relative" style={{ backgroundColor: '#f9fafb' }}>
              <div className="prose prose-sm max-w-none">
                {isConnecting ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#1f2937' }} />
                    <p className="font-semibold" style={{ color: '#1f2937' }}>AI分析中...</p>
                    <p className="text-sm mt-2" style={{ color: '#4b5563' }}>処理中...</p>
                  </div>
                ) : (
                  <div>
                    <AnalysisRenderer text={analysis} />
                    {isStreaming && (
                      <span className="inline-block w-2 h-5 animate-pulse ml-1" style={{ backgroundColor: '#1f2937' }}></span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onLineConversion}
              className="w-full font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-sm mt-6 hover:opacity-90"
              style={{ backgroundColor: '#ffff1e', color: '#1f2937' }}
            >
              <ExternalLink className="w-6 h-6 flex-shrink-0" />
              <span>LINEで定期AIレポートを受け取る</span>
            </button>

            <div className="mt-3 p-4 rounded-xl" style={{ backgroundColor: '#f3f4f6' }}>
              <div className="flex items-start gap-2 mb-2">
                <ExternalLink className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#1f2937' }} />
                <p className="text-sm font-bold" style={{ color: '#1f2937' }}>
                  【重要】外部サービスへの移動について
                </p>
              </div>
              <ul className="text-xs text-gray-700 leading-relaxed space-y-1.5 ml-1">
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5" style={{ color: '#1f2937' }}>•</span>
                  <span>このボタンをクリックすると、<strong>LINE公式アプリまたはLINE公式サイト（第三者サービス）に移動</strong>します。</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5" style={{ color: '#1f2937' }}>•</span>
                  <span>LINEは当サービスとは<strong>独立した別のサービス</strong>です。</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5" style={{ color: '#059669' }}>✓</span>
                  <span><strong className="text-green-700">現在無料</strong>：LINEへの移動後も現在追加料金はかかりません。</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5" style={{ color: '#059669' }}>✓</span>
                  <span>LINE友だち追加で定期的に最新のAI分析レポートが受け取れます（配信頻度はサービス状況によります）。</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
