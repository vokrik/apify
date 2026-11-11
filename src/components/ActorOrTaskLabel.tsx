import { ActorAvatar } from "@/components/ActorAvatar";
import { LockIcon } from "@/components/icons";

export type ActorOrTaskLabelProps = {
  title: string;
  /** `username/name`, already shortened if needed. */
  subtitle: string;
  /** Full value for the subtitle's tooltip. */
  subtitleTooltip?: string;
  /** Avatar of the Actor (a task shows its Actor's avatar). */
  avatar: { title: string; imageUrl?: string };
  isOwn?: boolean;
};

/**
 * Inside of Apify's `ActorOrTaskPill`: avatar, semibold title and subtitle with the "Own" flag.
 * Renders two siblings, so wrap it in a `group flex` element (a link or a button).
 */
export function ActorOrTaskLabel({
  title,
  subtitle,
  subtitleTooltip,
  avatar,
  isOwn,
}: ActorOrTaskLabelProps) {
  return (
    <>
      <span className="mr-2 flex items-center justify-center">
        <ActorAvatar title={avatar.title} imageUrl={avatar.imageUrl} size={32} />
      </span>
      <span className="min-w-0 grow">
        <span className="block text-sm font-semibold text-neutral-text group-hover:text-primary-action-hover">
          {title}
        </span>
        <span className="flex items-center gap-2 text-xs text-neutral-text-subtle">
          <span className="truncate" title={subtitleTooltip ?? subtitle}>
            {subtitle}
          </span>
          {isOwn && (
            <span className="flex items-center whitespace-nowrap">
              <LockIcon className="mr-[2px] size-3 text-neutral-icon-subtle" />
              Own
            </span>
          )}
        </span>
      </span>
    </>
  );
}
