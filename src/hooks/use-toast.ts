import type * as React from 'react';
import { toast as sonnerToast } from 'sonner';

type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

type ToastInput = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
};

function toast({ title, description, variant, duration }: ToastInput) {
  const message = title ?? '';
  const options = {
    description,
    duration,
  };

  switch (variant) {
    case 'destructive':
      return {
        id: sonnerToast.error(message, options),
        dismiss: () => sonnerToast.dismiss(),
        update: () => undefined,
      };
    case 'success':
      return {
        id: sonnerToast.success(message, options),
        dismiss: () => sonnerToast.dismiss(),
        update: () => undefined,
      };
    case 'warning':
      return {
        id: sonnerToast.warning(message, options),
        dismiss: () => sonnerToast.dismiss(),
        update: () => undefined,
      };
    case 'info':
      return {
        id: sonnerToast.info(message, options),
        dismiss: () => sonnerToast.dismiss(),
        update: () => undefined,
      };
    default:
      return {
        id: sonnerToast(message, options),
        dismiss: () => sonnerToast.dismiss(),
        update: () => undefined,
      };
  }
}

function useToast() {
  return {
    toasts: [],
    toast,
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
  };
}

export { useToast, toast };
