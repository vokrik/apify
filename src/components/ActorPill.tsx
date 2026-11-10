import { Link } from "react-router";

import { ActorAvatar } from "@/components/ActorAvatar";
import { LockIcon } from "@/components/icons";
import type { Actor } from "@/data/types";
import { truncateMiddle } from "@/lib/format";

export type ActorPillProps = {
  actor: Actor;
  /** `middle` shortens the slug to "underst...scraper" like the Runs and Tasks tables. */
  slug?: "full" | "middle";
};

/** Apify `ActorOrTaskPill`: avatar, title and `username/name` with the "Own" flag. */
export function ActorPill({ actor, slug = "full" }: ActorPillProps) {
  return (
    <Link to={`/actors/${actor.id}`} className="group flex min-h-[3.8rem] min-w-0">
      <span className="mr-2 flex items-center justify-center">
        <ActorAvatar title={actor.title} imageUrl={actor.imageUrl} size={32} />
      </span>
      <span className="min-w-0 grow">
        <span className="block text-sm font-semibold text-neutral-text group-hover:text-primary-action-hover">
          {actor.title}
        </span>
        <span className="flex items-center gap-2 text-xs text-neutral-text-subtle">
          <span className="truncate" title={actor.slug}>
            {slug === "middle" ? truncateMiddle(actor.slug) : actor.slug}
          </span>
          {actor.isOwn && (
            <span className="flex items-center whitespace-nowrap">
              <LockIcon className="mr-[2px] size-3 text-neutral-icon-subtle" />
              Own
            </span>
          )}
        </span>
      </span>
    </Link>
  );
}
