import Image from 'next/image';

export default function MessagesPage() {
  return (
    <div className="min-h-[calc(100vh-110px)] p-2.5 max-md:-m-2.5 max-md:p-0">
      <section className="flex min-h-[calc(100vh-130px)] w-full flex-col bg-white px-4 py-8 md:w-[370px] md:rounded-[20px] md:border md:border-outline-border md:px-5 md:py-6">
        <h1 className="border-b border-outline-border pb-6 text-2xl font-semibold tracking-[-0.02em] text-text-primary">
          Messages
        </h1>
        <div className="flex flex-1 flex-col items-center justify-center gap-2.5 text-center max-md:translate-y-2">
          <Image
            src="/assets/doctor-design/messages-empty.png"
            alt=""
            width={133}
            height={133}
            className="mix-blend-luminosity opacity-30"
          />
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold leading-[1.3] tracking-[-0.02em] text-text-primary">
              No Messages Yet!
            </h2>
            <p className="mx-auto max-w-[320px] text-sm leading-[1.5] text-text-secondary">
              Your conversations with patients will appear here after you complete a case review.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
