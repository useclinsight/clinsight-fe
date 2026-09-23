import Image from 'next/image';
import { cn } from '@/lib/utils';

/** Cover artwork for the "5 Lab Values Every Nigerian Should Understand" guide. */
export function BookCover({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/squeeze/squeeze_page_book_cover.png"
      alt="Cover of the guide: 5 Lab Values Every Nigerian Should Understand"
      width={426}
      height={576}
      priority
      className={cn(
        'mx-auto h-auto w-full max-w-65 rounded-xl shadow-[0_24px_60px_-20px_rgba(14,61,134,0.55)]',
        className,
      )}
    />
  );
}
