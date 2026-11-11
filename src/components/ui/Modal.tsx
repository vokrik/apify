import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Must include a Radix `Dialog.Title` (and usually `Dialog.Description`). */
  children: ReactNode;
  className?: string;
};

/** Centered dialog over a dimmed page (Radix Dialog: focus trap, Escape and outside click close it). */
export function Modal({ open, onOpenChange, children, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[200] bg-neutral-overlay/80" />
        <Dialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-[201] flex max-h-[calc(100vh-8rem)] w-[56rem] max-w-[calc(100vw-4rem)] -translate-1/2 flex-col rounded-lg border border-neutral-border bg-neutral-background text-neutral-text shadow-3 outline-none",
            className,
          )}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
