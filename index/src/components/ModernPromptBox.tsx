interface ModernPromptBoxProps {
  stockName?: string;
  stockCode?: string;
}

export default function ModernPromptBox({ stockName, stockCode }: ModernPromptBoxProps) {
  return (
    <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
        {stockName && stockCode ? (
          <p className="text-sm md:text-base text-gray-200 text-center leading-relaxed">
            <span className="text-modern-purple-300 font-semibold text-base md:text-lg block mb-1">
              {stockName}（{stockCode}）
            </span>
            の分析準備が完了しました
            <br />
            下のボタンをクリックして、AIレポートを受け取りましょう
          </p>
        ) : (
          <p className="text-sm md:text-base text-gray-200 text-center leading-relaxed">
            株式コードを入力すると、AIが
            <span className="text-white font-semibold"> 指標</span>、
            <span className="text-white font-semibold">データ</span>、
            <span className="text-white font-semibold">トレンド</span>
            を分析し、短時間で結果をご提供します
          </p>
        )}
      </div>
    </div>
  );
}
