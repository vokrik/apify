import type { ReactNode } from "react";

import { formatBytes } from "@/lib/format";
import type { WebhookRequest } from "@/services/actions";

/** Rows shown in the preview; the rest are summarized. */
const MAX_ROWS = 2;

/** Splits pretty-printed JSON into colored tokens (keys, strings, numbers, literals). */
function highlightJson(json: string): ReactNode[] {
  const token = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)|\b(true|false|null)\b/g;
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of json.matchAll(token)) {
    const [text, string, colon, number, literal] = match;
    const start = match.index;
    if (start > last) out.push(json.slice(last, start));
    if (string && colon) {
      out.push(
        <span key={start} className="text-primary-text">
          {string}
        </span>,
        colon,
      );
    } else if (string) {
      out.push(
        <span key={start} className="text-success-text">
          {string}
        </span>,
      );
    } else if (number) {
      out.push(
        <span key={start} className="text-warning-text">
          {number}
        </span>,
      );
    } else if (literal) {
      out.push(
        <span key={start} className="text-danger-text">
          {literal}
        </span>,
      );
    } else {
      out.push(text);
    }
    last = start + text.length;
  }
  out.push(json.slice(last));
  return out;
}

/** The webhook request as the platform would send it: request line, headers and JSON body. */
export function RequestPreview({ request }: { request: WebhookRequest }) {
  const body = { ...request.body };
  const rows = Array.isArray(body.data) ? body.data : null;
  const hidden = rows ? rows.length - MAX_ROWS : 0;
  if (rows && hidden > 0) body.data = rows.slice(0, MAX_ROWS);

  return (
    <figure
      aria-label="Request preview"
      className="flex min-h-0 flex-col overflow-hidden rounded-md border border-neutral-separator-subtle"
    >
      <figcaption className="flex items-baseline justify-between gap-2 border-b border-neutral-separator-subtle bg-neutral-background-muted px-3 py-2">
        <span className="text-xs font-semibold text-neutral-text">Request preview</span>
        <span className="text-xs text-neutral-text-subtle">
          Example data · {request.rowCount === 1 ? "1 row" : `${request.rowCount} rows`}
        </span>
      </figcaption>
      {request.skipped && (
        <p className="border-b border-neutral-separator-subtle bg-warning-background px-3 py-2 text-xs text-warning-chip-text">
          With this example nothing is sent: the transformation returned no rows, and empty results
          are skipped.
        </p>
      )}
      {request.oversize && (
        <p className="border-b border-neutral-separator-subtle bg-primary-background-subtle px-3 py-2 text-xs text-primary-chip-text">
          A full run ({formatBytes(request.fullRun.payloadBytes)}) is over the{" "}
          {formatBytes(request.oversize.limitBytes)} limit.{" "}
          {"batch" in request.body
            ? `It's sent in ${request.oversize.requests} requests; this is the first one.`
            : "A dataset link is sent instead of the rows."}
        </p>
      )}
      <pre className="min-h-0 flex-1 overflow-auto bg-neutral-background p-3 font-mono text-xs leading-[1.8rem] [overflow-wrap:anywhere] whitespace-pre-wrap text-neutral-text">
        <span className="font-semibold text-primary-text">{request.method}</span>{" "}
        <span className="break-all">{request.url}</span>
        {"\n"}
        {Object.entries(request.headers).map(([name, value]) => (
          <span key={name} className="text-neutral-text-subtle">
            {name}: {value}
            {"\n"}
          </span>
        ))}
        {"\n"}
        {highlightJson(JSON.stringify(body, null, 2))}
        {hidden > 0 && (
          <span className="text-neutral-text-subtle">
            {"\n"}
            {`// …and ${hidden} more ${hidden === 1 ? "row" : "rows"} in "data"`}
          </span>
        )}
      </pre>
    </figure>
  );
}
