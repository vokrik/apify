import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { sendTestRequest, type TestResult, type WebhookAction } from "@/services/actions";

export type TestRequestProps = {
  action: WebhookAction;
  disabled: boolean;
};

/**
 * "Send test request": delivers the previewed request (simulated) and shows the response.
 * Remount it (via `key`) when the settings change, so a stale result isn't shown.
 */
export function TestRequest({ action, disabled }: TestRequestProps) {
  const [state, setState] = useState<"idle" | "sending" | TestResult>("idle");

  const send = async () => {
    setState("sending");
    setState(await sendTestRequest(action));
  };

  return (
    <section
      aria-label="Test request"
      className="flex shrink-0 flex-col gap-2 rounded-md border border-neutral-separator-subtle p-3"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-neutral-text-subtle">
          Sends the request above to your URL, with example data.
        </p>
        <Button size="small" disabled={disabled || state === "sending"} onClick={send}>
          {state === "sending" ? "Sending…" : "Send test request"}
        </Button>
      </div>
      {typeof state === "object" && (
        <output aria-label="Test response" className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs">
            {state.ok ? (
              <Badge variant="success">
                {state.status} {state.statusText}
              </Badge>
            ) : (
              <Badge variant="danger">Failed</Badge>
            )}
            <span className="text-neutral-text-subtle tabular-nums">{state.durationMs} ms</span>
          </div>
          <code className="font-mono text-xs break-all text-neutral-text-muted">
            {state.ok ? state.body : state.error}
          </code>
        </output>
      )}
    </section>
  );
}
