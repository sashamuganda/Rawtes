import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

/* --- Dropdown --- */
export const Dropdown = DropdownMenu.Root;
export const DropdownTrigger = DropdownMenu.Trigger;

export const DropdownContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenu.DropdownMenuContentProps
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-surface p-1 shadow-md animate-scale-in',
        className
      )}
      {...props}
    />
  </DropdownMenu.Portal>
));

export const DropdownItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenu.DropdownMenuItemProps
>(({ className, ...props }, ref) => (
  <DropdownMenu.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-surface-hover focus:bg-surface-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-text-primary',
      className
    )}
    {...props}
  />
));

/* --- Toast System (Simple) --- */
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: string) => void }> = ({ 
  toasts, 
  onDismiss 
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => onDismiss(toast.id)}
            className={cn(
              "flex min-w-[200px] cursor-pointer items-center justify-between rounded-lg p-4 shadow-lg border",
              toast.type === 'success' && "bg-green-50 border-green-200 text-green-800",
              toast.type === 'error' && "bg-red-50 border-red-200 text-red-800",
              toast.type === 'warning' && "bg-amber-50 border-amber-200 text-amber-800",
              toast.type === 'info' && "bg-blue-50 border-blue-200 text-blue-800"
            )}
          >
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
