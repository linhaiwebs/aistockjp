import { useState, useEffect } from 'react';

const carouselItems = [
  {
    id: 1,
    background: 'repeating-conic-gradient(#bae6fd 0% 25%, #e0f2fe 0% 50%) 50% / 20px 20px',
    rotation: '2deg',
    titleLine1: 'AIで分析',
    titleLine2: '株式情報ツール',
    titleLine3: '',
    highlightedWord: '株式情報ツール',
    topLeftIcon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="36" cy="36" r="34" fill="#0ea5e9" />
        <path d="M36 20 C36 20, 50 28, 50 40 C50 48, 44 52, 36 52 C28 52, 22 48, 22 40 C22 28, 36 20, 36 20Z" fill="#0284c7" />
        <ellipse cx="30" cy="30" rx="8" ry="12" fill="#7dd3fc" opacity="0.6" />
      </svg>
    ),
    topRightIcon: (
      <div className="w-16 h-16 bg-amber-400 rounded-lg shadow-lg flex items-center justify-center">
        <span className="text-2xl font-black text-gray-900">GO</span>
      </div>
    ),
    bottomLeftAvatars: true,
    bottomRightIcon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28 8 L32 24 L48 24 L35 34 L40 50 L28 40 L16 50 L21 34 L8 24 L24 24 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: 2,
    background: 'repeating-conic-gradient(#99f6e4 0% 25%, #ccfbf1 0% 50%) 50% / 20px 20px',
    rotation: '-2deg',
    titleLine1: '銘柄データ',
    titleLine2: '確認',
    titleLine3: '',
    highlightedWord: '確認',
    topLeftIcon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="36" cy="36" r="34" fill="#0d9488" />
        <circle cx="36" cy="36" r="28" fill="#FFFFFF" />
        <circle cx="36" cy="36" r="22" fill="#14b8a6" />
        <path d="M28 32 L36 36 L44 28" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    ),
    topRightIcon: (
      <div className="w-16 h-16 bg-coral-300 rounded-lg shadow-lg flex items-center justify-center">
        <span className="text-xs font-black text-gray-900">RATE</span>
      </div>
    ),
    bottomLeftAvatars: false,
    bottomRightIcon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="24" fill="#fbbf24" />
        <path d="M28 12 L32 20 L40 22 L34 28 L36 36 L28 32 L20 36 L22 28 L16 22 L24 20 Z" fill="#f97316" />
      </svg>
    ),
  },
  {
    id: 3,
    background: 'repeating-conic-gradient(#fed7aa 0% 25%, #ffedd5 0% 50%) 50% / 20px 20px',
    rotation: '2deg',
    titleLine1: '株式情報',
    titleLine2: 'レポート作成',
    titleLine3: '',
    highlightedWord: 'レポート作成',
    topLeftIcon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="coinGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <radialGradient id="coinShine" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="36" cy="36" r="35" fill="#b45309" />
        <circle cx="36" cy="36" r="32" fill="url(#coinGradient)" />
        <circle cx="36" cy="36" r="30" fill="none" stroke="#d97706" strokeWidth="0.5" />
        <circle cx="36" cy="36" r="27" fill="none" stroke="#b45309" strokeWidth="0.5" />
        <ellipse cx="28" cy="26" rx="8" ry="12" fill="url(#coinShine)" />
      </svg>
    ),
    topRightIcon: (
      <div className="w-16 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bar1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="bar2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5eead4" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
            <linearGradient id="bar3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id="bar4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
          <rect x="7" y="20" width="5" height="12" rx="1" fill="url(#bar1)" />
          <rect x="14" y="10" width="5" height="22" rx="1" fill="url(#bar2)" />
          <polygon points="16.5,8 18,10 15,10" fill="#2dd4bf" />
          <rect x="21" y="15" width="5" height="17" rx="1" fill="url(#bar3)" />
          <rect x="28" y="6" width="5" height="26" rx="1" fill="url(#bar4)" />
        </svg>
      </div>
    ),
    bottomLeftAvatars: true,
    bottomRightIcon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="28" cy="52" rx="20" ry="3" fill="#000000" opacity="0.15" />
        <path
          d="M28 8 L32 24 L48 24 L35 34 L40 50 L28 40 L16 50 L21 34 L8 24 L24 24 Z"
          fill="url(#trophyGradient)"
          stroke="#d97706"
          strokeWidth="1"
        />
        <rect x="24" y="46" width="8" height="6" fill="#d97706" rx="1" />
        <rect x="20" y="52" width="16" height="3" fill="#b45309" rx="1" />
        <defs>
          <linearGradient id="trophyGradient" x1="28" y1="8" x2="28" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
];

export default function IllustrationCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentItem = carouselItems[currentIndex];

  return (
    <div className="relative w-full max-w-[280px] mx-auto px-4">
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500"
        style={{
          transform: `rotate(${currentItem.rotation})`,
          background: currentItem.background,
        }}
      >
        <div className="relative p-6 pb-14 min-h-[280px] flex flex-col">
          <div className="absolute -top-8 -left-8 z-20">
            <div className="relative">{currentItem.topLeftIcon}</div>
          </div>

          <div className="absolute top-6 right-6 z-10">{currentItem.topRightIcon}</div>

          <div className="flex-1 flex flex-col items-start justify-center mt-6 mb-10">
            <div className="text-left mb-4 w-full">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{currentItem.titleLine1}</h1>
              {currentItem.titleLine2 && (
                <div className="w-full -mx-6">
                  <div
                    className="px-6 py-2"
                    style={{
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                    }}
                  >
                    <h2 className="text-xl font-bold text-white leading-tight whitespace-nowrap">
                      {currentItem.titleLine2}
                    </h2>
                  </div>
                </div>
              )}
              {currentItem.titleLine3 && (
                <h1 className="text-4xl font-bold text-gray-900 mt-2">{currentItem.titleLine3}</h1>
              )}
            </div>
          </div>

          {currentItem.bottomLeftAvatars && (
            <div className="absolute bottom-6 left-6 flex items-center space-x-[-12px] z-10">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="18" r="7" fill="#FFA07A" />
                  <circle cx="24" cy="16" r="6" fill="#FFB6A3" />
                  <circle cx="20" cy="16" r="1.5" fill="#1a1a1a" />
                  <circle cx="28" cy="16" r="1.5" fill="#1a1a1a" />
                  <path d="M20 19 Q24 21 28 19" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeLinecap="round" />
                  <ellipse cx="24" cy="10" rx="8" ry="6" fill="#2C1810" />
                  <path d="M16 30C16 26 19 24 24 24C29 24 32 26 32 30L32 38 L16 38Z" fill="#4A90E2" />
                  <rect x="16" y="38" width="16" height="8" fill="#5AA3F5" rx="1" />
                </svg>
              </div>

              <div className="w-12 h-12 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="18" r="7" fill="#D4A574" />
                  <circle cx="24" cy="16" r="6" fill="#E8C4A0" />
                  <circle cx="20" cy="16" r="1.5" fill="#1a1a1a" />
                  <circle cx="28" cy="16" r="1.5" fill="#1a1a1a" />
                  <path d="M21 19 Q24 20 27 19" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeLinecap="round" />
                  <ellipse cx="24" cy="10" rx="8" ry="5" fill="#8B6F47" />
                  <path d="M16 30C16 26 19 24 24 24C29 24 32 26 32 30L32 38 L16 38Z" fill="#E74C3C" />
                  <rect x="16" y="38" width="16" height="8" fill="#FF6B6B" rx="1" />
                </svg>
              </div>

              <div className="w-12 h-12 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="18" r="7" fill="#F5CBA7" />
                  <circle cx="24" cy="16" r="6" fill="#FADBD8" />
                  <circle cx="20" cy="16" r="1.5" fill="#1a1a1a" />
                  <circle cx="28" cy="16" r="1.5" fill="#1a1a1a" />
                  <path d="M20 20 Q24 22 28 20" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeLinecap="round" />
                  <path d="M16 10 Q24 6 32 10" fill="#FF6B9D" />
                  <path d="M16 30C16 26 19 24 24 24C29 24 32 26 32 30L32 38 L16 38Z" fill="#9B59B6" />
                  <rect x="16" y="38" width="16" height="8" fill="#B07CC6" rx="1" />
                </svg>
              </div>

              <div className="w-12 h-12 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="18" r="7" fill="#C9A587" />
                  <circle cx="24" cy="16" r="6" fill="#DEB887" />
                  <circle cx="20" cy="16" r="1.5" fill="#1a1a1a" />
                  <circle cx="28" cy="16" r="1.5" fill="#1a1a1a" />
                  <path d="M21 19 Q24 21 27 19" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeLinecap="round" />
                  <ellipse cx="24" cy="10" rx="8" ry="5" fill="#5D4E37" />
                  <circle cx="19" cy="16" r="1" fill="#FF69B4" />
                  <circle cx="29" cy="16" r="1" fill="#FF69B4" />
                  <path d="M16 30C16 26 19 24 24 24C29 24 32 26 32 30L32 38 L16 38Z" fill="#27AE60" />
                  <rect x="16" y="38" width="16" height="8" fill="#52D273" rx="1" />
                </svg>
              </div>
            </div>
          )}

          <div className="absolute bottom-6 right-6 z-10">
            <div className="relative">{currentItem.bottomRightIcon}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="transition-all duration-300"
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentIndex ? (
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }}
              ></div>
            ) : (
              <div className="w-2 h-2 rounded-full bg-ocean-300"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
