import { BlobOptions } from 'buffer';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}


function hasCustomBg(className?: string): boolean {
  return /\bbg-[^\s]+\b/.test(className ?? '');
}

export function Button({ children, className, ...rest }: ButtonProps) {
  const primaryColor = "bg-blue-500 hover:bg-blue-400 focus-visible:outline-blue-500 active:bg-blue-600"
  const useDefaultBg = !hasCustomBg(className);
  return (
    <button
      {...rest}
      className={clsx(
        'flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        useDefaultBg && 'bg-blue-500 hover:bg-blue-400 active:bg-blue-600 focus-visible:outline-blue-500',
        className
      )}
    >
      {children}
    </button>
  );
}
