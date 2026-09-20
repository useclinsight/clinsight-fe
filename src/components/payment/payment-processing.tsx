export function PaymentProcessing() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <style>{`
        @keyframes fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.1; }
        }
      `}</style>
      <div className="relative h-12 w-12">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1 h-2.5 w-0.5 rounded-full bg-[#1565C0]"
            style={{
              transform: `translateX(-50%) rotate(${i * 45}deg)`,
              transformOrigin: '50% 22px',
              opacity: (i + 1) / 8,
              animation: `fade 1s linear infinite`,
              animationDelay: `${(i / 8) * -1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
