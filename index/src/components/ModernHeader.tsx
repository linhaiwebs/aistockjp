import AIRobotLogo from './AIRobotLogo';

export default function ModernHeader() {
  return (
    <div className="text-center animate-fadeIn relative -mt-12 md:-mt-16">
      <div className="relative z-20">
        <AIRobotLogo />
      </div>

      <div className="relative -mt-24 z-30">
        <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full mb-3 shadow-lg animate-pulse">
          現在無料 • アカウント不要 • すぐに開始
        </div>
        <p className="text-base md:text-lg text-white leading-relaxed px-4 drop-shadow-lg font-medium">
          <span className="font-semibold text-cyan-300">銘柄コード</span>を入力するだけで
          <br />
          <span className="font-semibold text-blue-300">AIが迅速に分析</span>
          <br />
          詳細レポートを取得
        </p>
        <p className="text-xs md:text-sm text-cyan-200/90 mt-2 drop-shadow-lg">
          高速処理 • 利用制限なし • データ保護
        </p>
      </div>
    </div>
  );
}
