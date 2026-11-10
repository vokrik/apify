import type { User } from "./types";

export const currentUser: User = {
  id: "hNi0yP1qLAN6cZLbe",
  username: "understandable_hummock",
  displayName: "Martin",
  accountLabel: "Personal",
  avatarUrl: "/images/users/current-user.png",
  plan: "FREE",
};

/** "Now" for the prototype — all relative dates and the usage chart are computed from this. */
export const NOW = new Date("2026-11-10T18:15:00");

export const accountLimits = {
  ramUsedMb: 0,
  ramTotalGb: 16,
  usageUsd: 0.35,
  usageLimitUsd: 5,
};
