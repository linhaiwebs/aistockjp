import { Shield, Lock, Zap, TrendingUp } from 'lucide-react';

export default function TrustBadges() {
  return (
    <div className="w-full max-w-md mx-auto px-4 mb-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/40 rounded-lg p-3 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-2 rounded-full">
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-xs font-bold text-cyan-100 drop-shadow-lg">現在無料</p>
          <p className="text-[10px] text-cyan-200/80 drop-shadow-lg">無料でご利用可能</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 backdrop-blur-md border border-blue-400/40 rounded-lg p-3 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-full">
              <Lock className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-xs font-bold text-blue-100 drop-shadow-lg">安全保護</p>
          <p className="text-[10px] text-blue-200/80 drop-shadow-lg">データ暗号化</p>
        </div>

        <div className="bg-gradient-to-br from-teal-500/20 to-teal-600/20 backdrop-blur-md border border-teal-400/40 rounded-lg p-3 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-2 rounded-full">
              <Zap className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-xs font-bold text-teal-100 drop-shadow-lg">迅速分析</p>
          <p className="text-[10px] text-teal-200/80 drop-shadow-lg">短時間で完了</p>
        </div>

        <div className="bg-gradient-to-br from-sky-500/20 to-sky-600/20 backdrop-blur-md border border-sky-400/40 rounded-lg p-3 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-2 rounded-full">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-xs font-bold text-sky-100 drop-shadow-lg">AI分析</p>
          <p className="text-[10px] text-sky-200/80 drop-shadow-lg">詳細分析</p>
        </div>
      </div>
    </div>
  );
}
