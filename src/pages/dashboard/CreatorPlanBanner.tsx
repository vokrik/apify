import { CloseIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

export function CreatorPlanBanner({ onClose }: { onClose: () => void }) {
  return (
    <section
      aria-label="Creator plan"
      className="relative flex overflow-hidden rounded-md border border-neutral-border bg-neutral-background-muted"
    >
      <div className="flex-1 px-4 pt-4 pb-[1.8rem]">
        <h2 className="text-2xl font-semibold">Are you building and publishing your own Actors?</h2>
        <p className="mt-6 max-w-[98rem] text-sm text-neutral-text-muted">
          With the <strong className="font-semibold text-neutral-text">Creator plan</strong>, get
          $500 total in platform usage for your first 6 months at $1 a month to build and test
          Actors. Some Apify Store Actors aren't included.
        </p>
        <Button variant="primary" className="mt-5">
          Subscribe
        </Button>
      </div>
      <img
        src="/images/illustrations/creator-plan-gift.png"
        alt=""
        className="mt-[3.6rem] mr-[2.4rem] h-[132px] w-[105px] shrink-0 self-start"
      />
      <Button iconOnly aria-label="Dismiss" onClick={onClose} className="absolute top-4 right-4">
        <CloseIcon />
      </Button>
    </section>
  );
}
