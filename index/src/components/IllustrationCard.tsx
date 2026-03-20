export default function IllustrationCard() {
  return (
    <div className="relative w-full max-w-[280px] mx-auto px-4">
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{
          transform: 'rotate(2deg)',
          background: 'repeating-conic-gradient(#a8e6a1 0% 25%, #c8f5c3 0% 50%) 50% / 20px 20px'
        }}
      >
        <div className="relative p-6 pb-14 min-h-[320px] flex flex-col">
          <div className="absolute -top-8 -left-8 z-20">
            <div className="relative">
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="coinGradient" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="60%" stopColor="#FFC700" />
                    <stop offset="100%" stopColor="#FFA500" />
                  </radialGradient>
                  <radialGradient id="coinShine" cx="30%" cy="30%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="36" cy="36" r="35" fill="#B8860B" />
                <circle cx="36" cy="36" r="32" fill="url(#coinGradient)" />
                <circle cx="36" cy="36" r="30" fill="none" stroke="#DAA520" strokeWidth="0.5" />
                <circle cx="36" cy="36" r="27" fill="none" stroke="#B8860B" strokeWidth="0.5" />
                <circle cx="36" cy="36" r="24" fill="none" stroke="#DAA520" strokeWidth="0.5" />
                <path d="M36 18 L38 20 L40 18 L40 24 L44 24 L44 28 L40 28 L40 32 L44 32 L44 36 L40 36 L40 44 L44 44 L44 48 L40 48 L40 54 L38 52 L36 54 L34 52 L32 54 L32 48 L28 48 L28 44 L32 44 L32 36 L28 36 L28 32 L32 32 L32 28 L28 28 L28 24 L32 24 L32 18 L34 20 Z" fill="#B8860B" opacity="0.3" />
                <ellipse cx="28" cy="26" rx="8" ry="12" fill="url(#coinShine)" />
              </svg>
            </div>
          </div>

          <div className="absolute top-6 right-6 z-10">
            <div className="w-16 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bar1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F87171" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                  <linearGradient id="bar2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                  <linearGradient id="bar3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                  <linearGradient id="bar4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FB923C" />
                    <stop offset="100%" stopColor="#F97316" />
                  </linearGradient>
                </defs>
                <rect x="7" y="20" width="5" height="12" rx="1" fill="url(#bar1)" />
                <rect x="14" y="10" width="5" height="22" rx="1" fill="url(#bar2)" />
                <polygon points="16.5,8 18,10 15,10" fill="#10B981" />
                <rect x="21" y="15" width="5" height="17" rx="1" fill="url(#bar3)" />
                <rect x="28" y="6" width="5" height="26" rx="1" fill="url(#bar4)" />
              </svg>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-start justify-center mt-6 mb-10">
            <div className="text-left mb-4">
              <h1 className="text-5xl font-bold text-gray-900">AI</h1>
            </div>

            <div className="w-full -mx-6">
              <div
                className="px-6 py-3"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)'
                }}
              >
                <h2 className="text-2xl font-bold text-white leading-tight">
                  株式インテリジェント分析監視ツール
                </h2>
              </div>
            </div>
          </div>

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

          <div className="absolute bottom-6 right-6 z-10">
            <div className="relative">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="28" cy="52" rx="20" ry="3" fill="#000000" opacity="0.15" />
                <path
                  d="M28 8 L32 24 L48 24 L35 34 L40 50 L28 40 L16 50 L21 34 L8 24 L24 24 Z"
                  fill="url(#trophyGradient)"
                  stroke="#B8860B"
                  strokeWidth="1"
                />
                <rect x="24" y="46" width="8" height="6" fill="#B8860B" rx="1" />
                <rect x="20" y="52" width="16" height="3" fill="#8B7500" rx="1" />
                <defs>
                  <linearGradient id="trophyGradient" x1="28" y1="8" x2="28" y2="50" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFA500" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
