import { currentUser, NOW } from "@/data/user";
import { getActor, getTask } from "@/services/actors";
import { exampleResult, type TransformationConfig } from "@/services/transformations";

// Simulated backend for the automation's action: a webhook called once the transformation is
// done. Builds the request the platform would send (for the preview) and fakes a test delivery.

// --- Settings ---------------------------------------------------------------------------------

export type WebhookAuth =
  | { type: "none" }
  | { type: "bearer"; token: string }
  | { type: "basic"; username: string; password: string }
  | { type: "header"; name: string; value: string }
  | { type: "signature"; secret: string };

export const authTypes: { id: WebhookAuth["type"]; label: string }[] = [
  { id: "none", label: "None" },
  { id: "bearer", label: "Bearer token" },
  { id: "basic", label: "Basic auth" },
  { id: "header", label: "Custom header" },
  { id: "signature", label: "Signing secret (HMAC)" },
];

export function emptyAuth(type: WebhookAuth["type"]): WebhookAuth {
  switch (type) {
    case "none":
      return { type };
    case "bearer":
      return { type, token: "" };
    case "basic":
      return { type, username: "", password: "" };
    case "header":
      return { type, name: "X-Api-Key", value: "" };
    case "signature":
      return { type, secret: "" };
  }
}

/** A new random signing secret, like the ones payment providers issue. */
export function generateSigningSecret(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return `whsec_${[...bytes].map((b) => alphabet[b % alphabet.length]).join("")}`;
}

/** What to do when the rows don't fit under the payload size limit. */
export type OversizeBehavior = "dataset-link" | "split";

export type FailureHandling = {
  /** Off: a failed request is logged and not retried. */
  enabled: boolean;
  /** Retries after the first attempt, with exponential backoff. */
  retries: number;
  timeoutSecs: number;
  /** Email after the last retry fails; null = no email. */
  notifyEmail: string | null;
};

export type WebhookAction = {
  url: string;
  auth: WebhookAuth;
  /** Send the rows in the payload; otherwise send a link to a new dataset with them. */
  includeData: boolean;
  /** Payload size limit in MB, as typed (used when `includeData`). */
  sizeLimitMb: string;
  oversize: OversizeBehavior;
  /** Don't call the webhook when the transformation returns no rows. */
  skipWhenEmpty: boolean;
  failure: FailureHandling;
};

export const defaultWebhookAction: WebhookAction = {
  url: "",
  auth: { type: "none" },
  includeData: false,
  sizeLimitMb: "5",
  oversize: "dataset-link",
  skipWhenEmpty: true,
  failure: { enabled: false, retries: 3, timeoutSecs: 30, notifyEmail: currentUser.email },
};

export const retryOptions = [1, 3, 5, 10];
export const timeoutOptions = [10, 30, 60, 120];

/** Delays before each retry: 1 min, 2 min, 4 min, … */
export function retrySchedule(retries: number): string {
  const delays = Array.from({ length: retries }, (_, i) => 2 ** i);
  const shown = delays.slice(0, 4).map((m) => (m < 60 ? `${m} min` : `${m / 60} h`));
  return delays.length > 4 ? `${shown.join(", ")}, …` : shown.join(", ");
}

// --- Validation -------------------------------------------------------------------------------

const filled = (value: string) => value.trim() !== "";

export function isValidWebhookUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    return (parsed.protocol === "https:" || parsed.protocol === "http:") && parsed.hostname !== "";
  } catch {
    return false;
  }
}

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export function parseSizeLimit(value: string): number | null {
  const mb = Number(value);
  return value.trim() !== "" && Number.isFinite(mb) && mb > 0 ? mb : null;
}

export function isAuthComplete(auth: WebhookAuth): boolean {
  switch (auth.type) {
    case "none":
      return true;
    case "bearer":
      return filled(auth.token);
    case "basic":
      return filled(auth.username) && filled(auth.password);
    case "header":
      return /^[A-Za-z0-9-]+$/.test(auth.name.trim()) && filled(auth.value);
    case "signature":
      return auth.secret.trim().length >= 16;
  }
}

export function isActionValid(action: WebhookAction): boolean {
  return (
    isValidWebhookUrl(action.url) &&
    isAuthComplete(action.auth) &&
    (!action.includeData || parseSizeLimit(action.sizeLimitMb) !== null) &&
    (!action.failure.enabled ||
      action.failure.notifyEmail === null ||
      isValidEmail(action.failure.notifyEmail))
  );
}

/** One-line summary on the step card. */
export function summarizeAction(action: WebhookAction): string {
  const url = action.url.trim().replace(/^https?:\/\//, "");
  return `${url} · ${action.includeData ? "rows in payload" : "dataset link"}`;
}

// --- Request ----------------------------------------------------------------------------------

/** Secrets are never shown in full: keep the last 4 characters of longer ones. */
export function maskSecret(secret: string): string {
  const s = secret.trim();
  return s.length > 8 ? `••••••••${s.slice(-4)}` : "••••••••";
}

/** Not real HMAC-SHA256 — a stable stand-in that looks like one for the preview. */
function fakeSignature(payload: string, secret: string): string {
  let hex = "";
  let h = 2166136261;
  const input = `${secret}.${payload}`;
  for (let round = 0; hex.length < 64; round++) {
    for (let i = 0; i < input.length; i++) {
      h ^= input.charCodeAt(i) + round;
      h = Math.imul(h, 16777619) >>> 0;
    }
    hex += h.toString(16).padStart(8, "0");
  }
  return hex.slice(0, 64);
}

/** The header the auth adds to the request, with secrets masked (for the preview). */
function authHeader(auth: WebhookAuth, body: string): [string, string] | null {
  switch (auth.type) {
    case "none":
      return null;
    case "bearer":
      return ["Authorization", `Bearer ${maskSecret(auth.token)}`];
    case "basic":
      return ["Authorization", `Basic ${maskSecret(`${auth.username}:${auth.password}`)}`];
    case "header":
      return [auth.name.trim() || "X-Api-Key", maskSecret(auth.value)];
    case "signature":
      // The signature isn't secret: it's computed from the body, so it's shown in full.
      return ["X-Apify-Signature", `sha256=${fakeSignature(body, auth.secret)}`];
  }
}

/** Results of a full Amazon Scraper run (see `runs.ts`), used to size the transformed dataset. */
const RUN_ITEM_COUNT = 2063;
const SAMPLE_RUN_ID = "HG7ML7M8z78YcAPEB";
const SAMPLE_DATASET_ID = "WkzbQMuFYuamGv3YF";

export type TriggerRef = { type: "actor"; id: string } | { type: "task"; id: string };

export type WebhookRequest = {
  method: "POST";
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
  /** Rows the example transformation returned. */
  rowCount: number;
  /** The same transformation on a full run, estimated from the example. */
  fullRun: { itemCount: number; payloadBytes: number };
  /** Nothing would be sent: no rows and `skipWhenEmpty`. */
  skipped: boolean;
  /** Rows don't fit under the size limit. */
  oversize: { limitBytes: number; requests: number } | null;
};

/** The request sent after a run of the trigger has been transformed, for the example data. */
export function buildWebhookRequest(
  action: WebhookAction,
  trigger: TriggerRef | null,
  transformation: TransformationConfig | null,
): WebhookRequest {
  const { input, rows } = transformation ? exampleResult(transformation) : { input: 0, rows: [] };
  const items = rows.map((r) => r.row);

  const triggerSlug =
    trigger?.type === "actor"
      ? getActor(trigger.id)?.slug
      : trigger?.type === "task"
        ? getTask(trigger.id)?.slug
        : undefined;

  // The preview only knows the example rows; scale them to a full run.
  const itemCount = input === 0 ? 0 : Math.round((RUN_ITEM_COUNT * items.length) / input);
  const bytesPerItem = items.length ? Math.round(JSON.stringify(items).length / items.length) : 0;
  const payloadBytes = itemCount * bytesPerItem;

  const limitMb = parseSizeLimit(action.sizeLimitMb);
  const limitBytes = limitMb === null ? Infinity : Math.round(limitMb * 1024 * 1024);
  const tooBig = action.includeData && payloadBytes > limitBytes;
  const sendData = action.includeData && !(tooBig && action.oversize === "dataset-link");
  const requests = tooBig ? Math.ceil(payloadBytes / limitBytes) : 1;

  const body: Record<string, unknown> = {
    eventType: "AUTOMATION.SUCCEEDED",
    createdAt: new Date(NOW.getTime() + 2000).toISOString(),
    trigger: { type: trigger?.type ?? "actor", id: triggerSlug ?? null, runId: SAMPLE_RUN_ID },
    transformation: transformation?.id ?? null,
  };
  if (sendData) {
    if (tooBig) body.batch = { index: 1, count: requests };
    body.data = items;
  } else {
    body.dataset = {
      datasetId: SAMPLE_DATASET_ID,
      url: `https://api.apify.com/v2/datasets/${SAMPLE_DATASET_ID}/items?format=json`,
      itemCount,
      sizeBytes: payloadBytes,
    };
  }

  const auth = authHeader(action.auth, JSON.stringify(body));
  return {
    method: "POST",
    url: action.url.trim() || "https://example.com/webhook",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "ApifyAutomations/1.0",
      ...(auth ? { [auth[0]]: auth[1] } : {}),
    },
    body,
    rowCount: items.length,
    fullRun: { itemCount, payloadBytes },
    skipped: action.skipWhenEmpty && items.length === 0,
    oversize: tooBig ? { limitBytes, requests } : null,
  };
}

// --- Test delivery ----------------------------------------------------------------------------

export type TestResult =
  | { ok: true; status: number; statusText: string; durationMs: number; body: string }
  | { ok: false; error: string; durationMs: number };

/** Hosts that can't be reached from Apify's servers (the `.invalid` TLD never resolves). */
const unreachable = (hostname: string) =>
  hostname.endsWith(".invalid")
    ? "Could not resolve host"
    : hostname === "localhost" || hostname.startsWith("127.")
      ? "Connection refused: localhost isn't reachable from Apify"
      : null;

/** Simulated delivery of the previewed request (fake latency, deterministic response). */
export async function sendTestRequest(action: WebhookAction, latencyMs = 400): Promise<TestResult> {
  await new Promise((resolve) => setTimeout(resolve, latencyMs));
  const url = new URL(action.url.trim());
  // Stable "response time" per URL, so repeated tests look consistent.
  const durationMs = 120 + ([...url.href].reduce((sum, c) => sum + c.charCodeAt(0), 0) % 280);
  const error = unreachable(url.hostname);
  if (error) return { ok: false, error, durationMs };
  return { ok: true, status: 200, statusText: "OK", durationMs, body: '{"received":true}' };
}
