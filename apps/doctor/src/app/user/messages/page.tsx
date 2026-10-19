import { MessagesSquare } from 'lucide-react';

export default function MessagesPage() {
  return (
    <main className="min-h-[calc(100vh-120px)] p-2.5 sm:p-4">
      <section className="flex min-h-[calc(100vh-140px)] w-full flex-col rounded-2xl border border-[#F0F0F0] bg-white p-4 md:max-w-[263px]">
        <h1 className="border-b border-[#F0F0F0] pb-4 text-xl font-medium text-[#1B1B1B]">
          Messages
        </h1>
        <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
          <MessagesSquare
            size={88}
            strokeWidth={2.2}
            className="text-[#B3B3B3]"
            aria-hidden="true"
          />
          <h2 className="mt-4 text-lg font-semibold text-[#1B1B1B]">No Messages Yet!</h2>
          <p className="mt-1 text-sm leading-5 text-[#5E5E5E]">
            Your conversations with patients will appear here after you complete a case review.
          </p>
        </div>
      </section>
    </main>
  );
}
