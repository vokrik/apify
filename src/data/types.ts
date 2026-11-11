export type User = {
  id: string;
  username: string;
  displayName: string;
  /** Label shown under the name in the sidebar ("Personal" or an organization name). */
  accountLabel: string;
  avatarUrl?: string;
  plan: "FREE" | "STARTER" | "SCALE" | "BUSINESS";
};

export type Actor = {
  id: string;
  /** Human readable title, e.g. "Google Search Results Scraper". */
  title: string;
  /** `username/actor-name` */
  slug: string;
  description: string;
  imageUrl?: string;
  /** Owned by the current user (shows the "Own" flag). */
  isOwn?: boolean;
};

export type StoreActor = Actor & {
  author: { name: string; avatarUrl?: string };
  /** Total users, pre-formatted the same way the Store shows it ("94K"). */
  users: string;
  rating?: { value: number; count: number };
};

export type RunStatus =
  | "READY"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "TIMING-OUT"
  | "TIMED-OUT"
  | "ABORTING"
  | "ABORTED";

export type ActorRun = {
  id: string;
  actorId: string;
  taskId?: string;
  status: RunStatus;
  /** ISO timestamp (UTC is fine — the prototype renders it as-is). */
  startedAt: string;
  durationSecs: number;
  resultCount: number;
  usageUsd: number;
};

export type ActorTask = {
  id: string;
  actorId: string;
  title: string;
  /** `username/task-name` */
  slug: string;
};

export type RecentlyViewedItem =
  | { kind: "actor"; actorId: string }
  | { kind: "run"; runId: string }
  | { kind: "task"; taskId: string };

export type ApiToken = {
  id: string;
  title: string;
  createdAt: string;
};

export type PricingModel = "PAY_PER_USAGE" | "PAY_PER_EVENT" | "RENTAL" | "FREE";

export type Automation = {
  id: string;
  name: string;
  /** `username/automation-name` */
  slug: string;
  /** The Actor whose run triggers this automation. */
  triggerActorId: string;
  pricing: PricingModel;
  lastRun?: { startedAt: string; status: RunStatus };
};

/** A dataset the user already has (e.g. a saved snapshot used as a baseline). */
export type Dataset = {
  id: string;
  name: string;
  itemCount: number;
  createdAt: string;
};

export type DatasetColumn = {
  key: string;
  type: "string" | "number";
};

/** A dataset row; `null` is a missing value. */
export type DatasetRow = Record<string, string | number | null>;

export type TransformationCategory = "builtin" | "marketplace" | "own";

export type TransformationId =
  | "get-changed-rows"
  | "get-new-rows"
  | "get-missing-rows"
  | "products-below-threshold"
  | "filter-incomplete-data"
  | "filter-by-sentiment";

export type Transformation = {
  id: TransformationId;
  title: string;
  description: string;
  category: TransformationCategory;
  /** `username` of the publisher (Marketplace and own transformations). */
  author?: string;
};

export type Sentiment = "positive" | "neutral" | "negative";
