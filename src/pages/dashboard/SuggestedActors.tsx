import { CloseIcon } from "@/components/icons";
import { ActorStoreCard } from "@/components/store/ActorStoreCard";
import { Button } from "@/components/ui/Button";
import { getSuggestedActors } from "@/services/actors";

export function SuggestedActors({ onClose }: { onClose: () => void }) {
  const actors = getSuggestedActors();
  return (
    <section aria-labelledby="suggested-actors-heading">
      <div className="mb-[1rem] flex items-center justify-between">
        <h2 id="suggested-actors-heading" className="text-sm font-medium">
          Suggested Actors for you
        </h2>
        <Button
          variant="ghost"
          size="small"
          iconOnly
          aria-label="Hide suggested Actors"
          onClick={onClose}
          className="-my-1"
        >
          <CloseIcon />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {actors.map((actor) => (
          <ActorStoreCard key={actor.id} actor={actor} />
        ))}
      </div>
    </section>
  );
}
