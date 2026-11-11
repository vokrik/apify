import { useState } from "react";

import { ChevronDownIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { TextInput } from "@/components/ui/TextInput";
import { currentUser } from "@/data/user";
import { cn } from "@/lib/cn";
import { formatBytes } from "@/lib/format";
import {
  authTypes,
  buildWebhookRequest,
  defaultWebhookAction,
  emptyAuth,
  generateSigningSecret,
  isActionValid,
  isValidEmail,
  isValidWebhookUrl,
  type OversizeBehavior,
  parseSizeLimit,
  retryOptions,
  retrySchedule,
  timeoutOptions,
  type TriggerRef,
  type WebhookAction,
  type WebhookAuth,
} from "@/services/actions";
import type { TransformationConfig } from "@/services/transformations";

import { StepEditorHeader } from "../StepEditorHeader";
import { RequestPreview } from "./RequestPreview";
import { TestRequest } from "./TestRequest";

function AuthFields({
  auth,
  onChange,
}: {
  auth: WebhookAuth;
  onChange: (auth: WebhookAuth) => void;
}) {
  switch (auth.type) {
    case "none":
      return null;
    case "bearer":
      return (
        <TextInput
          aria-label="Token"
          type="password"
          autoComplete="off"
          placeholder="Token"
          value={auth.token}
          onChange={(e) => onChange({ ...auth, token: e.target.value })}
        />
      );
    case "basic":
      return (
        <div className="grid grid-cols-2 gap-2">
          <TextInput
            aria-label="Username"
            autoComplete="off"
            placeholder="Username"
            value={auth.username}
            onChange={(e) => onChange({ ...auth, username: e.target.value })}
          />
          <TextInput
            aria-label="Password"
            type="password"
            autoComplete="off"
            placeholder="Password"
            value={auth.password}
            onChange={(e) => onChange({ ...auth, password: e.target.value })}
          />
        </div>
      );
    case "header":
      return (
        <div className="grid grid-cols-2 gap-2">
          <TextInput
            aria-label="Header name"
            autoComplete="off"
            placeholder="Header name"
            className="font-mono"
            value={auth.name}
            onChange={(e) => onChange({ ...auth, name: e.target.value })}
          />
          <TextInput
            aria-label="Header value"
            type="password"
            autoComplete="off"
            placeholder="Value"
            value={auth.value}
            onChange={(e) => onChange({ ...auth, value: e.target.value })}
          />
        </div>
      );
    case "signature":
      return (
        <>
          <div className="flex gap-2">
            <TextInput
              aria-label="Signing secret"
              type="password"
              autoComplete="off"
              placeholder="At least 16 characters"
              className="flex-1"
              value={auth.secret}
              onChange={(e) => onChange({ ...auth, secret: e.target.value })}
            />
            <Button onClick={() => onChange({ ...auth, secret: generateSigningSecret() })}>
              Generate
            </Button>
          </div>
          <p className="text-xs text-neutral-text-subtle">
            Each request is signed with HMAC-SHA256 of its raw body. Recompute it with this secret
            and compare it with the <code className="font-mono">X-Apify-Signature</code> header.
          </p>
        </>
      );
  }
}

/** A checkbox with a label and help text underneath. */
function CheckboxOption({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex w-fit cursor-pointer items-start gap-2">
      <span className="pt-[2px]">
        <Checkbox aria-label={label} checked={checked} onChange={onChange} />
      </span>
      <span>
        <span className="block text-sm">{label}</span>
        <span className="block text-xs text-neutral-text-subtle">{description}</span>
      </span>
    </label>
  );
}

export type ActionEditorProps = {
  value: WebhookAction | null;
  /** Earlier steps, so the preview shows what this automation would actually send. */
  trigger: TriggerRef | null;
  transformation: TransformationConfig | null;
  onSave: (action: WebhookAction) => void;
  onClose: () => void;
  inDialog: boolean;
};

/** The action step: a webhook called once the transformation is done, with a request preview. */
export function ActionEditor({
  value,
  trigger,
  transformation,
  onSave,
  onClose,
  inDialog,
}: ActionEditorProps) {
  const [action, setAction] = useState<WebhookAction>(value ?? defaultWebhookAction);
  const [urlTouched, setUrlTouched] = useState(false);
  const [failureOpen, setFailureOpen] = useState(action.failure.enabled);
  const set = (patch: Partial<WebhookAction>) => setAction({ ...action, ...patch });
  const setFailure = (patch: Partial<WebhookAction["failure"]>) =>
    set({ failure: { ...action.failure, ...patch } });

  const showUrlError = urlTouched && action.url.trim() !== "" && !isValidWebhookUrl(action.url);
  const sizeLimitInvalid = action.includeData && parseSizeLimit(action.sizeLimitMb) === null;
  const { notifyEmail } = action.failure;
  const emailInvalid = notifyEmail !== null && notifyEmail !== "" && !isValidEmail(notifyEmail);
  const request = buildWebhookRequest(action, trigger, transformation);
  const valid = isActionValid(action);

  return (
    <>
      <StepEditorHeader
        title="Send webhook"
        description="Calls your URL with an HTTP POST request once the transformation is done."
        onClose={onClose}
        inDialog={inDialog}
      />
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-6 border-t border-neutral-separator-subtle p-4">
        <div className="-mr-2 flex min-w-0 flex-col gap-6 overflow-y-auto pr-2">
          <FormField
            label="URL"
            description="Your endpoint that accepts POST requests (http or https)."
          >
            <TextInput
              aria-label="URL"
              type="url"
              placeholder="https://example.com/webhooks/apify"
              value={action.url}
              aria-invalid={showUrlError}
              onChange={(e) => set({ url: e.target.value })}
              onBlur={() => setUrlTouched(true)}
              className={showUrlError ? "border-danger-field-border" : undefined}
            />
            {showUrlError && (
              <p className="text-xs text-danger-text">
                Enter a valid URL, e.g. https://example.com.
              </p>
            )}
          </FormField>

          <FormField
            label="Authentication"
            description="How your endpoint verifies that the request comes from Apify. Secrets are stored encrypted and never shown in full."
          >
            <Select
              aria-label="Authentication"
              value={action.auth.type}
              options={authTypes.map((t) => ({ value: t.id, label: t.label }))}
              onChange={(type) => set({ auth: emptyAuth(type as WebhookAuth["type"]) })}
            />
            <AuthFields auth={action.auth} onChange={(auth) => set({ auth })} />
          </FormField>

          <FormField label="Payload">
            <CheckboxOption
              label="Include data in the payload"
              description={
                action.includeData
                  ? "The transformed rows are sent in the request as an array of JSON objects (data)."
                  : "The transformed rows are saved to a new dataset. The request only links to it (dataset): its ID, a URL to fetch the rows, the number of rows and the size in bytes."
              }
              checked={action.includeData}
              onChange={(includeData) => set({ includeData })}
            />
            {action.includeData && (
              <div className="ml-[2.4rem] flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-[12rem] shrink-0 text-xs text-neutral-text-subtle">
                    Size limit
                  </span>
                  <span className="relative">
                    <TextInput
                      aria-label="Size limit in MB"
                      inputMode="decimal"
                      aria-invalid={sizeLimitInvalid}
                      className={cn(
                        "w-[10rem] pr-[3.6rem]",
                        sizeLimitInvalid && "border-danger-field-border",
                      )}
                      value={action.sizeLimitMb}
                      onChange={(e) => set({ sizeLimitMb: e.target.value })}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-[11px] -translate-y-1/2 text-sm text-neutral-text-subtle">
                      MB
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-[12rem] shrink-0 text-xs text-neutral-text-subtle">
                    If the rows don't fit
                  </span>
                  <Select
                    aria-label="If the rows don't fit"
                    className="flex-1"
                    value={action.oversize}
                    options={[
                      { value: "dataset-link", label: "Send a dataset link instead" },
                      { value: "split", label: "Split into several requests" },
                    ]}
                    onChange={(oversize) => set({ oversize: oversize as OversizeBehavior })}
                  />
                </div>
                <p className="text-xs text-neutral-text-subtle">
                  A full run of the trigger returns about{" "}
                  {request.fullRun.itemCount.toLocaleString("en-US")} rows (
                  {formatBytes(request.fullRun.payloadBytes)}).
                  {request.oversize &&
                    (action.oversize === "split"
                      ? ` That's over the limit, so they're sent in ${request.oversize.requests} requests.`
                      : " That's over the limit, so a dataset link is sent instead.")}
                </p>
              </div>
            )}
          </FormField>

          <FormField label="Delivery">
            <CheckboxOption
              label="Skip when there are no rows"
              description="If the transformation returns no rows, your URL isn't called."
              checked={action.skipWhenEmpty}
              onChange={(skipWhenEmpty) => set({ skipWhenEmpty })}
            />
          </FormField>

          <section className="flex flex-col gap-3 border-t border-neutral-separator-subtle pt-4">
            <button
              type="button"
              aria-expanded={failureOpen}
              onClick={() => setFailureOpen(!failureOpen)}
              className="flex cursor-pointer items-center justify-between gap-2 text-left"
            >
              <span>
                <span className="block text-sm font-semibold">
                  Failure handling{" "}
                  <span className="font-normal text-neutral-text-subtle">(optional)</span>
                </span>
                <span className="block text-xs text-neutral-text-subtle">
                  {action.failure.enabled
                    ? `${action.failure.retries} ${action.failure.retries === 1 ? "retry" : "retries"}, ${action.failure.timeoutSecs} s timeout${action.failure.notifyEmail ? ", email on failure" : ""}`
                    : "By default, a failed request isn't retried."}
                </span>
              </span>
              <ChevronDownIcon
                className={cn(
                  "size-4 shrink-0 [stroke-width:2px] text-neutral-text-subtle transition-transform duration-150",
                  failureOpen && "rotate-180",
                )}
              />
            </button>
            {failureOpen && (
              <div className="flex flex-col gap-3">
                <CheckboxOption
                  label="Retry failed requests"
                  description="A request fails if your URL doesn't answer with a 2xx status in time."
                  checked={action.failure.enabled}
                  onChange={(enabled) => setFailure({ enabled })}
                />
                {action.failure.enabled && (
                  <div className="ml-[2.4rem] flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-[12rem] shrink-0 text-xs text-neutral-text-subtle">
                        Timeout
                      </span>
                      <Select
                        aria-label="Timeout"
                        className="w-[16rem]"
                        value={String(action.failure.timeoutSecs)}
                        options={timeoutOptions.map((s) => ({ value: String(s), label: `${s} s` }))}
                        onChange={(s) => setFailure({ timeoutSecs: Number(s) })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-[12rem] shrink-0 text-xs text-neutral-text-subtle">
                        Retries
                      </span>
                      <Select
                        aria-label="Retries"
                        className="w-[16rem]"
                        value={String(action.failure.retries)}
                        options={retryOptions.map((n) => ({ value: String(n), label: String(n) }))}
                        onChange={(n) => setFailure({ retries: Number(n) })}
                      />
                      <span className="text-xs text-neutral-text-subtle">
                        after {retrySchedule(action.failure.retries)}
                      </span>
                    </div>
                    <label className="flex w-fit cursor-pointer items-center gap-2 text-sm">
                      <Checkbox
                        aria-label="Email me when all retries fail"
                        checked={action.failure.notifyEmail !== null}
                        onChange={(on) =>
                          setFailure({ notifyEmail: on ? currentUser.email : null })
                        }
                      />
                      Email me when all retries fail
                    </label>
                    {action.failure.notifyEmail !== null && (
                      <>
                        <TextInput
                          aria-label="Notification email"
                          type="email"
                          aria-invalid={emailInvalid}
                          className={cn(
                            "ml-[2.4rem]",
                            emailInvalid && "border-danger-field-border",
                          )}
                          value={action.failure.notifyEmail}
                          onChange={(e) => setFailure({ notifyEmail: e.target.value })}
                        />
                        {emailInvalid && (
                          <p className="ml-[2.4rem] text-xs text-danger-text">
                            Enter a valid email.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
        <div className="flex min-h-0 min-w-0 flex-col gap-3">
          <RequestPreview request={request} />
          <TestRequest key={JSON.stringify(action)} action={action} disabled={!valid} />
        </div>
      </div>
      <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-neutral-separator-subtle px-4 py-3">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="primary" disabled={!valid} onClick={() => onSave(action)}>
          Save action
        </Button>
      </footer>
    </>
  );
}
