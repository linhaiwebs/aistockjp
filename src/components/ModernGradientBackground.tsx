export default function ModernGradientBackground() {
  return (
    <div className="fixed inset-0 w-full h-full z-0">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(180deg, #000000 0%, #0a0e1a 30%, #0d1321 60%, #0a192f 100%)'
        }}
      />
      <div className="absolute inset-0 w-full h-full opacity-30">
        <svg className="absolute top-1/4 left-1/4 w-32 h-32 text-blue-500/10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
        </svg>
        <svg className="absolute top-1/3 right-1/4 w-24 h-24 text-blue-600/10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
        </svg>
        <svg className="absolute bottom-1/4 left-1/3 w-28 h-28 text-slate-600/10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
        </svg>
        <svg className="absolute top-2/3 right-1/3 w-20 h-20 text-blue-700/10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-slate-800/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}
