import { Link } from "react-router";

import { ActorAvatar } from "@/components/ActorAvatar";
import { StarIcon, UsersIcon } from "@/components/icons";
import type { StoreActor } from "@/data/types";

/** Apify `ActorStoreItem` card (Store listing / dashboard suggestions). */
export function ActorStoreCard({ actor }: { actor: StoreActor }) {
  return (
    <Link
      to={`/actors/${actor.id}/info`}
      data-test="actor-card"
      className="group relative flex h-full min-h-[170px] flex-col gap-[0.2rem] rounded-md bg-neutral-background-subtle p-[0.2rem] text-neutral-text"
    >
      <div className="grow rounded-sm bg-neutral-background p-4 transition-shadow duration-[120ms] ease-in-out group-hover:shadow-[0_0_0_2px_var(--color-neutral-border)]">
        <div data-test="actor-store-item-header" className="flex items-center gap-3">
          <ActorAvatar title={actor.title} imageUrl={actor.imageUrl} size={40} />
          <div className="flex flex-col justify-center overflow-hidden">
            <h3 className="truncate text-sm font-semibold text-neutral-text">{actor.title}</h3>
            <p className="truncate font-mono text-xs font-medium text-neutral-text-subtle">
              {actor.slug}
            </p>
          </div>
        </div>
        <p className="mt-2 line-clamp-3 text-xs text-neutral-text-muted">{actor.description}</p>
      </div>
      <div className="flex w-full justify-between gap-1 px-2 py-1">
        <div className="flex items-center gap-1 overflow-hidden">
          {actor.author.avatarUrl && (
            <img
              src={actor.author.avatarUrl}
              alt="User avatar"
              className="size-[20px] rounded-full border border-neutral-border"
            />
          )}
          <p className="truncate text-xs font-medium text-neutral-text-muted">
            {actor.author.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {actor.rating && (
            <>
              <div className="flex items-center gap-1 text-neutral-text-muted">
                <StarIcon className="size-3" />
                <p className="text-xs font-medium">{actor.rating.value.toFixed(1)}</p>
                <p className="text-xs text-neutral-text-subtle">({actor.rating.count})</p>
              </div>
              <div className="h-[8px] w-px bg-neutral-separator-subtle" />
            </>
          )}
          <div className="flex items-center gap-1 text-neutral-text-muted">
            <UsersIcon className="size-3" />
            <p className="text-xs font-medium">{actor.users}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
