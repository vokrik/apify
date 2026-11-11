import { describe, expect, it } from "vitest";

import {
  buildWebhookRequest,
  defaultWebhookAction,
  generateSigningSecret,
  isActionValid,
  maskSecret,
  retrySchedule,
  sendTestRequest,
  summarizeAction,
  type WebhookAction,
} from "./actions";
import { defaultConfig } from "./transformations";

const trigger = { type: "actor", id: "amazon-scraper" } as const;
const action: WebhookAction = { ...defaultWebhookAction, url: "https://hooks.example.com/apify" };

describe("webhook action", () => {
  it("needs a valid http(s) URL and complete authentication", () => {
    expect(isActionValid(defaultWebhookAction)).toBe(false);
    expect(isActionValid({ ...action, url: "ftp://example.com" })).toBe(false);
    expect(isActionValid(action)).toBe(true);
    expect(isActionValid({ ...action, auth: { type: "bearer", token: "" } })).toBe(false);
    expect(isActionValid({ ...action, auth: { type: "bearer", token: "secret" } })).toBe(true);
    expect(isActionValid({ ...action, auth: { type: "header", name: "X Bad", value: "v" } })).toBe(
      false,
    );
  });

  it("sends the transformed rows when data is included", () => {
    const request = buildWebhookRequest(
      { ...action, includeData: true },
      trigger,
      defaultConfig("get-new-rows"),
    );
    expect(request.body.data).toEqual([
      expect.objectContaining({ sku: "SKU-321", name: "Laptop sleeve" }),
    ]);
    expect(request.body).not.toHaveProperty("dataset");
    expect(request.body.trigger).toMatchObject({ id: "understandable_hummock/amazon-scraper" });
  });

  it("sends a link to a new dataset otherwise", () => {
    const request = buildWebhookRequest(action, trigger, defaultConfig("get-new-rows"));
    expect(request.body).not.toHaveProperty("data");
    expect(request.body.dataset).toMatchObject({
      datasetId: expect.any(String),
      url: expect.stringMatching(/^https:\/\/api\.apify\.com\/v2\/datasets\/\w+\/items/),
      itemCount: expect.any(Number),
      sizeBytes: expect.any(Number),
    });
  });

  it("adds the auth header with the secret masked", () => {
    const bearer = buildWebhookRequest(
      { ...action, auth: { type: "bearer", token: "sk_live_1234567890abcd" } },
      trigger,
      null,
    );
    expect(bearer.headers.Authorization).toBe("Bearer ••••••••abcd");
    const header = buildWebhookRequest(
      { ...action, auth: { type: "header", name: "X-Api-Key", value: "short" } },
      trigger,
      null,
    );
    expect(header.headers["X-Api-Key"]).toBe("••••••••");
    expect(maskSecret("short")).not.toContain("short");
  });

  it("summarizes the action for the step card", () => {
    expect(summarizeAction({ ...action, includeData: true })).toBe(
      "hooks.example.com/apify · rows in payload",
    );
  });
});

describe("webhook delivery options", () => {
  it("is skipped when the transformation returns no rows, unless turned off", () => {
    // Nothing is below a 1 € threshold in the example data.
    const config = defaultConfig("products-below-threshold");
    if (config.id !== "products-below-threshold") throw new Error();
    const empty = {
      ...config,
      rules: [{ ...config.rules[0]!, threshold: { column: "price", value: "1" } }],
    };
    expect(buildWebhookRequest(action, trigger, empty).skipped).toBe(true);
    expect(buildWebhookRequest({ ...action, skipWhenEmpty: false }, trigger, empty).skipped).toBe(
      false,
    );
    expect(buildWebhookRequest(action, trigger, defaultConfig("get-new-rows")).skipped).toBe(false);
  });

  it("falls back to a dataset link or splits when the rows exceed the size limit", () => {
    const big = { ...action, includeData: true, sizeLimitMb: "0.01" };
    const link = buildWebhookRequest(big, trigger, defaultConfig("get-new-rows"));
    expect(link.oversize).not.toBeNull();
    expect(link.body).toHaveProperty("dataset");
    expect(link.body).not.toHaveProperty("data");

    const split = buildWebhookRequest(
      { ...big, oversize: "split" },
      trigger,
      defaultConfig("get-new-rows"),
    );
    expect(split.body).toHaveProperty("data");
    expect(split.body.batch).toEqual({ index: 1, count: split.oversize!.requests });

    const fits = buildWebhookRequest(
      { ...big, sizeLimitMb: "5" },
      trigger,
      defaultConfig("get-new-rows"),
    );
    expect(fits.oversize).toBeNull();
    expect(isActionValid({ ...big, sizeLimitMb: "0" })).toBe(false);
  });

  it("signs the body when a signing secret is set", () => {
    const signed = buildWebhookRequest(
      { ...action, auth: { type: "signature", secret: "whsec_0123456789abcdef" } },
      trigger,
      null,
    );
    expect(signed.headers["X-Apify-Signature"]).toMatch(/^sha256=[0-9a-f]{64}$/);
    expect(generateSigningSecret()).toMatch(/^whsec_\w{32}$/);
    expect(isActionValid({ ...action, auth: { type: "signature", secret: "short" } })).toBe(false);
  });

  it("validates the failure notification email", () => {
    const failure = { ...action.failure, enabled: true };
    expect(isActionValid({ ...action, failure: { ...failure, notifyEmail: "nope" } })).toBe(false);
    expect(isActionValid({ ...action, failure: { ...failure, notifyEmail: null } })).toBe(true);
    expect(retrySchedule(3)).toBe("1 min, 2 min, 4 min");
  });

  it("simulates a test delivery", async () => {
    await expect(sendTestRequest(action, 0)).resolves.toMatchObject({ ok: true, status: 200 });
    await expect(
      sendTestRequest({ ...action, url: "https://hooks.example.invalid" }, 0),
    ).resolves.toMatchObject({ ok: false, error: "Could not resolve host" });
  });
});
