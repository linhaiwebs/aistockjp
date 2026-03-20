const ToyotaLogo = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6">
    <ellipse cx="24" cy="24" rx="12" ry="8" fill="none" stroke="currentColor" strokeWidth="2"/>
    <ellipse cx="24" cy="24" rx="8" ry="12" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const SonyLogo = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6">
    <text x="24" y="30" fontSize="20" fontWeight="bold" fill="currentColor" textAnchor="middle">SONY</text>
  </svg>
);

const NintendoLogo = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6">
    <rect x="12" y="12" width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="20" cy="24" r="3" fill="currentColor"/>
    <circle cx="28" cy="24" r="3" fill="currentColor"/>
  </svg>
);

const SoftBankLogo = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6">
    <circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M 24 14 L 24 34 M 18 20 L 30 28 M 18 28 L 30 20" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const HondaLogo = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6">
    <path d="M 14 18 L 14 30 M 14 24 L 34 24 M 34 18 L 34 30" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
);

const PanasonicLogo = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6">
    <path d="M 16 18 L 16 30 M 16 18 L 24 18 Q 28 18 28 24 Q 28 30 24 30 L 16 30" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function AnimatedAILogo() {
  const stockLogos = [
    { name: 'Toyota', component: ToyotaLogo },
    { name: 'Sony', component: SonyLogo },
    { name: 'Nintendo', component: NintendoLogo },
    { name: 'SoftBank', component: SoftBankLogo },
    { name: 'Honda', component: HondaLogo },
    { name: 'Panasonic', component: PanasonicLogo },
  ];

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative w-96 h-96">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative animate-breathe">
            <div className="absolute inset-0 rounded-full w-20 h-20 blur-3xl opacity-90 animate-pulse shadow-[0_0_60px_rgba(255,255,30,0.8)]" style={{backgroundColor: '#ffff1e'}}></div>

            <div className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,30,0.6),0_0_60px_rgba(255,255,30,0.4)] overflow-hidden" style={{background: 'linear-gradient(to bottom right, #ffff1e, #ffff1e, #ffea00)'}}>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent animate-shine"></div>
              <span className="text-3xl font-bold text-gray-900 drop-shadow-lg relative z-10">AI</span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
          <div className="w-44 h-44 rounded-full border border-white/90 shadow-lg"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-60 h-60 animate-orbit">
            {stockLogos.map((stock, index) => {
              const angle = (index * 360) / stockLogos.length;
              const radius = 120;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              return (
                <div
                  key={stock.name}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                >
                  <div className="bg-white/95 w-14 h-14 rounded-full shadow-xl flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform duration-300 animate-float-subtle border-2 border-white/50" style={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 30px rgba(255, 255, 255, 0.3)',
                    animationDelay: `${index * 0.5}s`
                  }}>
                    <div className="text-gray-800 animate-orbit-reverse">
                      <stock.component />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center animate-spin-fast">
          <div className="w-80 h-80 rounded-full border border-white/30 shadow-lg"></div>
        </div>
      </div>
    </div>
  );
}
