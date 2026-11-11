import * as Dialog from "@radix-ui/react-dialog";

import { ArrowLeftIcon, CloseIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

export type StepEditorHeaderProps = {
  title: string;
  description: string;
  onClose: () => void;
  /** Inside a `Modal`: uses the dialog's title and description so it's announced. */
  inDialog: boolean;
  /** Shows a back arrow before the title (e.g. to return to a picker). */
  onBack?: () => void;
  backLabel?: string;
};

/** Title, description and close button of a step editor (in a modal or the side panel). */
export function StepEditorHeader({
  title,
  description,
  onClose,
  inDialog,
  onBack,
  backLabel = "Back",
}: StepEditorHeaderProps) {
  const Title = inDialog ? Dialog.Title : "h2";
  const Description = inDialog ? Dialog.Description : "p";
  return (
    <header className="flex shrink-0 items-start justify-between gap-4 px-4 pt-4 pb-1">
      <div className="flex min-w-0 items-start gap-2">
        {onBack && (
          <Button
            variant="ghost"
            size="small"
            iconOnly
            aria-label={backLabel}
            title={backLabel}
            onClick={onBack}
          >
            <ArrowLeftIcon />
          </Button>
        )}
        <div className="flex min-w-0 flex-col gap-1">
          <Title className="text-lg font-semibold">{title}</Title>
          <Description className="text-sm text-neutral-text-subtle">{description}</Description>
        </div>
      </div>
      <Button variant="ghost" size="small" iconOnly aria-label="Close" onClick={onClose}>
        <CloseIcon className="size-3" />
      </Button>
    </header>
  );
}
