'use client';

import { Toaster } from 'sonner';

export function SonnerToaster() {
  return (
    <Toaster
      position="top-center"
      closeButton
      theme="system"
      richColors={false}
      expand={false}
      className="w-105 group max-w-[calc(100vw-2rem)]"
      toastOptions={{
        duration: 2000,
        unstyled: true,
        classNames: {
          toast: [
            'group pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden',
            'rounded-xl border px-4 py-3',
            'bg-white text-zinc-900',
            'border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
            'group-data-[sonner-theme=dark]:bg-zinc-950 group-data-[sonner-theme=dark]:text-zinc-50',
            'group-data-[sonner-theme=dark]:border-white/10 group-data-[sonner-theme=dark]:shadow-none',
          ].join(' '),
          success: [
            "before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-emerald-500 before:content-['']",
            'pl-[18px]',
            '[&_[data-icon]]:text-emerald-600 group-data-[sonner-theme=dark]:[&_[data-icon]]:text-emerald-300',
          ].join(' '),
          warning: [
            "before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-amber-500 before:content-['']",
            'pl-[18px]',
            '[&_[data-icon]]:text-amber-600 group-data-[sonner-theme=dark]:[&_[data-icon]]:text-amber-300',
          ].join(' '),
          error: [
            "before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-red-500 before:content-['']",
            'pl-[18px]',
            '[&_[data-icon]]:text-red-600 group-data-[sonner-theme=dark]:[&_[data-icon]]:text-red-300',
          ].join(' '),
          info: [
            "before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-sky-500 before:content-['']",
            'pl-[18px]',
            '[&_[data-icon]]:text-sky-600 group-data-[sonner-theme=dark]:[&_[data-icon]]:text-sky-300',
          ].join(' '),
          content: 'flex min-w-0 flex-1 flex-col gap-1 pr-10',
          title:
            'text-[14px] font-medium leading-[1.35] text-zinc-900 group-data-[sonner-theme=dark]:text-zinc-50',
          description:
            'text-[13px] leading-[1.5] text-zinc-600 group-data-[sonner-theme=dark]:text-zinc-300',
          icon: 'self-center text-zinc-500 group-data-[sonner-theme=dark]:text-zinc-300',
          actionButton: [
            'inline-flex h-9 shrink-0 items-center justify-center rounded-lg px-3.5',
            'border border-zinc-200 bg-white',
            'text-[13px] font-medium text-zinc-900',
            'transition-colors hover:bg-zinc-50',
            'group-data-[sonner-theme=dark]:border-white/10 group-data-[sonner-theme=dark]:bg-white/5 group-data-[sonner-theme=dark]:text-zinc-50 group-data-[sonner-theme=dark]:hover:bg-white/10',
          ].join(' '),
          cancelButton: [
            'inline-flex h-9 shrink-0 items-center justify-center rounded-lg px-3.5',
            'bg-transparent text-[13px] font-medium text-zinc-500 transition-colors',
            'hover:bg-zinc-50 group-data-[sonner-theme=dark]:text-zinc-300 group-data-[sonner-theme=dark]:hover:bg-white/10',
          ].join(' '),
          closeButton: [
            'absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center',
            'rounded-md text-zinc-400 transition-colors',
            'hover:bg-zinc-100 hover:text-zinc-600',
            'group-data-[sonner-theme=dark]:text-zinc-400 group-data-[sonner-theme=dark]:hover:bg-white/10 group-data-[sonner-theme=dark]:hover:text-zinc-200',
          ].join(' '),
        },
      }}
    />
  );
}
