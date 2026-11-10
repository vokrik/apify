import { cn } from "@/lib/cn";

export type ActorAvatarProps = {
  title: string;
  imageUrl?: string;
  /** Outer size in px, including the 1px border. */
  size?: number;
  className?: string;
};

function initials(title: string): string {
  const words = title
    .replace(/[^\p{L}\p{N} ]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  return words
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/**
 * Actor image with Apify's 1px border. Actors without an image get the generated
 * initials tile (orange → red gradient), like "AS" for Amazon Scraper.
 */
export function ActorAvatar({ title, imageUrl, size = 40, className }: ActorAvatarProps) {
  const radius = size >= 40 ? 12 : size >= 32 ? 8 : 6;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden border border-neutral-border",
        className,
      )}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={`${title} avatar`} className="size-full object-cover" />
      ) : (
        <span
          aria-hidden="true"
          // Generated avatar image in Apify — colors sampled from the Console (not theme tokens).
          className="flex size-full items-center justify-center bg-linear-to-b from-[#f9b200] via-[#e84565] to-[#ff443b] font-semibold text-[#4a0e1b]"
          style={{ fontSize: Math.round(size * 0.4) }}
        >
          {initials(title)}
        </span>
      )}
    </span>
  );
}
