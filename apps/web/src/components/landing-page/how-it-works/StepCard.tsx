'use client';
export interface StepCardProps {
  number: string;
  title: string;
  description: string;
  index: number;
}

export function StepCard({ number, title, description, index }: StepCardProps) {
  const isEven = index % 2 === 0;
  const rotationClass = isEven
    ? 'rotate-[-4deg] lg:-rotate-[7deg]'
    : 'rotate-[4deg] lg:rotate-[7deg]';

  return (
    <div
      className={`
        relative w-full bg-white 
        rounded-xl lg:rounded-[32px] 
        shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] lg:shadow-[0px_12px_40px_0px_rgba(0,0,0,0.08)]
        outline outline-[0.5px] outline-offset-[-0.5px] outline-black
        p-1.5 lg:p-3 pt-[28px] lg:pt-[72px]
        transition-all duration-500
        overflow-hidden
        ${rotationClass}
      `}
    >
      <div className="absolute top-2 lg:top-6 left-1/2 -translate-x-1/2 w-6 h-6 lg:w-12 lg:h-12 rounded-full border border-[#1565C0]/40 flex items-center justify-center bg-white z-20">
        <div className="w-3.5 h-3.5 lg:w-9 lg:h-9 bg-[#1565C0] rounded-full" />
      </div>

      <div className="w-full h-full bg-[#F1F6FB] rounded-lg lg:rounded-[24px] px-3 py-4 lg:px-9 lg:py-11 flex flex-col items-start min-h-[150px] lg:min-h-[400px]">
        <div className="bg-[#1B1B1B] rounded-[2px] lg:rounded-[4px] px-1.5 py-0.5 lg:px-3 lg:py-1 mb-2 lg:mb-6">
          <span className="text-white text-xs lg:text-5xl font-medium font-['Inter'] leading-none">
            {number}
          </span>
        </div>

        <h3 className="text-[#1B1B1B] text-[11px] sm:text-sm lg:text-[30px] font-bold font-['Inter'] leading-[1.2] mb-1.5 lg:mb-4 tracking-tight">
          {title}
        </h3>

        <p className="text-[#1B1B1B]/80 text-[9px] sm:text-xs lg:text-[18px] font-normal font-['Inter'] leading-relaxed text-left">
          {description}
        </p>
      </div>
    </div>
  );
}
