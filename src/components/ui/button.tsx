import type { ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; variant?: 'primary' | 'outline' | 'ghost' | 'light'; };
export function Button({ asChild, variant = 'primary', className, ...props }: Props) {
  const Component = asChild ? Slot : 'button';
  return <Component className={cn('tabo-button', `tabo-button-${variant}`, className)} {...props} />;
}