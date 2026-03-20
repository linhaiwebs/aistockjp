import AstronautAnimation from './AstronautAnimation';
import RocketAnimation from './RocketAnimation';
import LoadingProgressBars from './LoadingProgressBars';

interface InlineLoadingSceneProps {
  isVisible: boolean;
}

export default function InlineLoadingScene({ isVisible }: InlineLoadingSceneProps) {
  if (!isVisible) return null;

  return (
    <div className="w-full animate-fadeIn px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
          AI分析中
        </h2>
        <p className="text-sm md:text-base text-gray-300">
          数秒お待ちください...
        </p>
      </div>

      <div className="flex items-center justify-center gap-8 mb-8">
        <AstronautAnimation />
        <RocketAnimation />
      </div>

      <div className="max-w-md mx-auto">
        <LoadingProgressBars isVisible={isVisible} />
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400 leading-relaxed">
          すべてのデータは公開されている市場情報を使用しており、
          <br className="hidden sm:inline" />
          公開市場データに基づいて分析を行っています
        </p>
      </div>
    </div>
  );
}
