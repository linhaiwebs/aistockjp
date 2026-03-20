export default function AIStockLogo() {
  return (
    <svg
      width="192"
      height="192"
      viewBox="0 0 192 192"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-auto h-48 drop-shadow-2xl"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
          <stop offset="50%" stopColor="#2563eb" stopOpacity="1" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="192" height="192" rx="24" fill="url(#logoGradient)" opacity="0.1"/>

      <circle cx="96" cy="70" r="28" fill="url(#logoGradient)" opacity="0.2"/>
      <circle cx="96" cy="70" r="22" fill="url(#logoGradient)" opacity="0.3"/>

      <g filter="url(#glow)">
        <path
          d="M 96 48 L 86 58 M 96 48 L 106 58 M 86 58 L 76 68 M 86 58 L 96 68 M 106 58 L 96 68 M 106 58 L 116 68 M 76 68 L 70 78 M 76 68 L 86 78 M 96 68 L 86 78 M 96 68 L 106 78 M 116 68 L 106 78 M 116 68 L 122 78 M 70 78 L 76 88 M 86 78 L 96 88 M 106 78 L 96 88 M 122 78 L 116 88 M 76 88 L 86 92 M 96 88 L 86 92 M 96 88 L 106 92 M 116 88 L 106 92"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <circle cx="96" cy="48" r="4" fill="#3b82f6"/>
        <circle cx="86" cy="58" r="4" fill="#60a5fa"/>
        <circle cx="106" cy="58" r="4" fill="#60a5fa"/>
        <circle cx="76" cy="68" r="4" fill="#93c5fd"/>
        <circle cx="96" cy="68" r="4" fill="#60a5fa"/>
        <circle cx="116" cy="68" r="4" fill="#93c5fd"/>
        <circle cx="70" cy="78" r="3" fill="#bfdbfe"/>
        <circle cx="86" cy="78" r="4" fill="#93c5fd"/>
        <circle cx="106" cy="78" r="4" fill="#93c5fd"/>
        <circle cx="122" cy="78" r="3" fill="#bfdbfe"/>
      </g>

      <path
        d="M 30 120 L 50 110 L 70 115 L 90 100 L 110 105 L 130 95 L 150 90 L 165 100"
        stroke="url(#chartGradient)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />

      <path
        d="M 30 135 L 50 130 L 70 125 L 90 130 L 110 120 L 130 125 L 150 115 L 165 120"
        stroke="#60a5fa"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />

      <g transform="translate(96, 160)" textAnchor="middle">
        <text
          fill="#1e40af"
          fontSize="20"
          fontWeight="700"
          letterSpacing="2"
        >
          AI株式診断
        </text>
      </g>

      <g opacity="0.3">
        <rect x="35" y="120" width="2" height="25" fill="#60a5fa" opacity="0.3"/>
        <rect x="55" y="110" width="2" height="35" fill="#60a5fa" opacity="0.4"/>
        <rect x="75" y="115" width="2" height="30" fill="#60a5fa" opacity="0.3"/>
        <rect x="95" y="100" width="2" height="45" fill="#3b82f6" opacity="0.5"/>
        <rect x="115" y="105" width="2" height="40" fill="#60a5fa" opacity="0.4"/>
        <rect x="135" y="95" width="2" height="50" fill="#3b82f6" opacity="0.5"/>
        <rect x="155" y="90" width="2" height="55" fill="#3b82f6" opacity="0.6"/>
      </g>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          circle {
            animation: pulse 2s ease-in-out infinite;
          }
          circle:nth-child(2n) {
            animation-delay: 0.3s;
          }
          circle:nth-child(3n) {
            animation-delay: 0.6s;
          }
        `}
      </style>
    </svg>
  );
}
