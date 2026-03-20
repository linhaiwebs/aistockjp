interface ModernActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function ModernActionButton({ onClick, disabled = false }: ModernActionButtonProps) {
  return (
    <>
      <div className="relative animate-fadeIn mt-2" style={{ animationDelay: '0.3s' }}>
        <button
          onClick={onClick}
          disabled={disabled}
          className="w-full text-gray-900 font-bold py-4 px-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: disabled ? '#D1D5DB' : '#ffff1e',
            height: '56px'
          }}
        >
          <span className="text-lg">診断を開始する</span>
        </button>
      </div>
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 leading-relaxed">
          ※本診断は投資助言ではありません。投資判断は自己責任でお願いいたします。
        </p>
      </div>
    </>
  );
}
