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

export const tasks: ActorTask[] = [
  { id: "amazon-scraper-task", actorId: "amazon-scraper", title: "AmazonScraper" },
];
