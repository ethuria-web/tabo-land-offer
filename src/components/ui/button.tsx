import type { ComponentPropsWithRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva('tabo-button', {
  variants: {
    variant: { default: 'tabo-button-primary', primary: 'tabo-button-primary', cta: 'tabo-button-cta', outline: 'tabo-button-outline', ghost: 'tabo-button-ghost', light: 'tabo-button-light', secondary: 'bg-secondary text-secondary-foreground', destructive: 'bg-destructive text-primary-foreground', link: 'text-primary underline-offset-4 hover:underline' },
    size: { default: '', sm: 'min-h-8 px-3 text-sm', lg: 'min-h-12 px-8', icon: 'h-9 w-9 p-0' },
  }, defaultVariants: { variant: 'default', size: 'default' },
});
export type ButtonProps = ComponentPropsWithRef<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean | undefined };
export function Button({ asChild, variant = 'primary', size = 'default', className, ...props }: ButtonProps) {
  const Component = asChild ? Slot : 'button';
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}