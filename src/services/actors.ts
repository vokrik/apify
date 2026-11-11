import { actors, myActorIds, tasks } from "@/data/actors";
import { runs } from "@/data/runs";
import { storeActors, suggestedActorIds } from "@/data/storeActors";
import type { Actor, ActorRun, ActorTask, StoreActor } from "@/data/types";

export function getActor(id: string): Actor | undefined {
  return actors.find((a) => a.id === id) ?? storeActors.find((a) => a.id === id);
}

export function getTask(id: string): ActorTask | undefined {
  return tasks.find((t) => t.id === id);
}

/** The user's Actors list: own Actors plus Store Actors they've used. */
export function getMyActors(): Actor[] {
  return myActorIds.map((id) => getActor(id)).filter((a): a is Actor => !!a);
}

export function getMyTasks(): ActorTask[] {
  return tasks;
}

export function getRun(id: string): ActorRun | undefined {
  return runs.find((r) => r.id === id);
}

export function getRecentRuns(limit = 10): ActorRun[] {
  return runs.slice(0, limit);
}

export function getSuggestedActors(): StoreActor[] {
  return suggestedActorIds
    .map((id) => storeActors.find((a) => a.id === id))
    .filter((a): a is StoreActor => !!a);
}
