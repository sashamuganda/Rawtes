import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from './Button';
import { X } from 'lucide-react';

/* --- Input --- */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm ring-offset-bg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

/* --- Modal --- */
interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ children, open, onOpenChange, title, className }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content 
          className={cn(
            "fixed left-[50%] top-[45%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border border-border bg-surface p-6 shadow-modal animate-scale-in focus:outline-none",
            className
          )}
        >
          {title && (
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-display font-semibold text-text-primary">
                {title}
              </Dialog.Title>
              <Dialog.Close className="rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 hover:bg-surface-hover">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export { Input, Modal };
