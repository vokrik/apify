import type { Actor, ActorTask } from "./types";

/** Actors owned or used by the current user. */
export const actors: Actor[] = [
  {
    id: "amazon-scraper",
    title: "Amazon Scraper",
    slug: "understandable_hummock/amazon-scraper",
    description: "Scrapes product listings, prices and reviews from Amazon.",
    isOwn: true,
  },
];

/**
 * The user's Actors list ("Recent & Bookmarked"): their own Actors plus Store Actors they have run,
 * most recently used first. Store Actors resolve from `storeActors`.
 */
export const myActorIds = [
  "amazon-scraper",
  "nFJndFXA5zjCTuudP",
  "WnMxbsRLNbPeYL6ge",
  "hotel-review-aggregator",
];

export const tasks: ActorTask[] = [
  {
    id: "amazon-scraper-task",
    actorId: "amazon-scraper",
    title: "AmazonScraper",
    slug: "understandable_hummock/amazonscraper",
  },
  {
    id: "amazon-headphones-task",
    actorId: "amazon-scraper",
    title: "Headphones bestsellers",
    slug: "understandable_hummock/headphones-bestsellers",
  },
  {
    id: "brand-mentions-task",
    actorId: "nFJndFXA5zjCTuudP",
    title: "Brand mentions on Google",
    slug: "understandable_hummock/brand-mentions-on-google",
  },
  {
    id: "prague-hotels-task",
    actorId: "hotel-review-aggregator",
    title: "Prague hotel reviews",
    slug: "understandable_hummock/prague-hotel-reviews",
  },
];
