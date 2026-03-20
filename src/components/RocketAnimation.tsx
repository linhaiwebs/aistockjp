export default function RocketAnimation() {
  return (
    <div className="w-32 h-32 sm:w-40 sm:h-40 animate-rocket-lift">
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="rocketBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="rocketWindowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
          <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>

        <g className="rocket-main">
          <path d="M 100 30 L 85 60 L 85 130 L 115 130 L 115 60 Z" fill="url(#rocketBodyGradient)" stroke="#bae6fd" strokeWidth="2" />

          <ellipse cx="100" cy="30" rx="15" ry="20" fill="#5eead4" stroke="#bae6fd" strokeWidth="2" />

          <circle cx="100" cy="80" r="12" fill="url(#rocketWindowGradient)" stroke="#0ea5e9" strokeWidth="2">
            <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
          </circle>

          <path d="M 70 100 L 85 100 L 85 140 Z" fill="#14b8a6" stroke="#bae6fd" strokeWidth="2" />
          <path d="M 130 100 L 115 100 L 115 140 Z" fill="#14b8a6" stroke="#bae6fd" strokeWidth="2" />

          <rect x="92" y="100" width="5" height="15" rx="1" fill="#fcd34d" opacity="0.8" />
          <rect x="103" y="100" width="5" height="15" rx="1" fill="#fcd34d" opacity="0.8" />

          <circle cx="100" cy="50" r="3" fill="white" opacity="0.8" />
          <circle cx="105" cy="55" r="2" fill="white" opacity="0.6" />
        </g>

        <g className="flames">
          <ellipse cx="93" cy="135" rx="8" ry="15" fill="url(#flameGradient)" opacity="0.9">
            <animate attributeName="ry" values="15;25;15" dur="0.3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.6;0.9" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="100" cy="135" rx="10" ry="20" fill="url(#flameGradient)" opacity="0.95">
            <animate attributeName="ry" values="20;30;20" dur="0.25s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.95;0.7;0.95" dur="0.25s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="107" cy="135" rx="8" ry="15" fill="url(#flameGradient)" opacity="0.9">
            <animate attributeName="ry" values="15;25;15" dur="0.35s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.6;0.9" dur="0.35s" repeatCount="indefinite" />
          </ellipse>

          <ellipse cx="95" cy="145" rx="6" ry="12" fill="#fcd34d" opacity="0.7">
            <animate attributeName="ry" values="12;20;12" dur="0.4s" repeatCount="indefinite" />
            <animate attributeName="cy" values="145;155;145" dur="0.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="0.4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="105" cy="145" rx="6" ry="12" fill="#fcd34d" opacity="0.7">
            <animate attributeName="ry" values="12;20;12" dur="0.35s" repeatCount="indefinite" />
            <animate attributeName="cy" values="145;155;145" dur="0.35s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="0.35s" repeatCount="indefinite" />
          </ellipse>
        </g>

        <g className="smoke-particles" opacity="0.4">
          <circle cx="85" cy="160" r="4" fill="#94A3B8">
            <animate attributeName="cy" values="160;180;160" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="100" cy="165" r="5" fill="#94A3B8">
            <animate attributeName="cy" values="165;190;165" dur="2.5s" repeatCount="indefinite" begin="0.3s" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" begin="0.3s" />
          </circle>
          <circle cx="115" cy="160" r="4" fill="#94A3B8">
            <animate attributeName="cy" values="160;180;160" dur="2.2s" repeatCount="indefinite" begin="0.6s" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2.2s" repeatCount="indefinite" begin="0.6s" />
          </circle>
        </g>

        <g className="sparkles">
          <circle cx="80" cy="120" r="2" fill="#fcd34d">
            <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="120" cy="110" r="2" fill="#fcd34d">
            <animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite" begin="0.3s" />
          </circle>
          <circle cx="95" cy="90" r="1.5" fill="#fcd34d">
            <animate attributeName="opacity" values="0;1;0" dur="0.8s" repeatCount="indefinite" begin="0.5s" />
          </circle>
        </g>
      </svg>
    </div>
  );
}
