import { Link } from "react-router";

import { ActorOrTaskLabel } from "@/components/ActorOrTaskLabel";
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
      <ActorOrTaskLabel
        title={actor.title}
        subtitle={slug === "middle" ? truncateMiddle(actor.slug) : actor.slug}
        subtitleTooltip={actor.slug}
        avatar={actor}
        isOwn={actor.isOwn}
      />
    </Link>
  );
}
