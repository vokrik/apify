import type { StoreActor } from "./types";

/** Public Apify Store Actors. Images live in /public/images. */
export const storeActors: StoreActor[] = [
  {
    id: "WnMxbsRLNbPeYL6ge",
    title: "📩📍 Google Maps Email Extractor",
    slug: "lukaskrivka/google-maps-with-contact-details",
    description:
      "Extract Google Maps contact details. Scrape websites of Google Maps places for contact details and get email addresses, website, location, address, zipcode, phone number, social media links. Export scraped data, run the scraper via API, schedule and monitor runs, or integrate with other tools.",
    imageUrl: "/images/actors/google-maps-with-contact-details.png",
    author: { name: "Lukáš Křivka", avatarUrl: "/images/users/lukaskrivka.png" },
    users: "94K",
    rating: { value: 4.6, count: 221 },
  },
  {
    id: "nFJndFXA5zjCTuudP",
    title: "Google Search Results Scraper",
    slug: "apify/google-search-scraper",
    description:
      "Scrape Google Search Engine Results Pages (SERPs). Select the country or language and extract organic and paid results, AI Mode, AI overviews, ads, queries, People Also Ask, prices, reviews, like a Google SERP API. Export scraped data, run the scraper via API, schedule and monitor runs, or integrate with other tools.",
    imageUrl: "/images/actors/google-search-scraper.png",
    author: { name: "Apify", avatarUrl: "/images/users/apify.png" },
    users: "231K",
    rating: { value: 4.7, count: 218 },
  },
  {
    id: "hotel-review-aggregator",
    title: "Hotel Review Aggregator",
    slug: "h_reviews/hotel-review-aggregator",
    description:
      "Add Google Maps place IDs or URLs and get hotel reviews from Tripadvisor, Yelp, Google Maps, Expedia, Hotels.com, Booking.com, Airbnb in one dataset. Export reviews in JSON, CSV, Excel and more, or integrate with other tools.",
    imageUrl: "/images/actors/hotel-review-aggregator.png",
    author: { name: "Hospitality", avatarUrl: "/images/users/h_reviews.png" },
    users: "646",
    rating: { value: 4.1, count: 7 },
  },
];

/** Shown in "Suggested Actors for you" on the dashboard. */
export const suggestedActorIds = [
  "WnMxbsRLNbPeYL6ge",
  "nFJndFXA5zjCTuudP",
  "hotel-review-aggregator",
];
