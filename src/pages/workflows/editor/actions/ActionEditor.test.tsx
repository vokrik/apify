import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderApp } from "@/test/render";

const step = (kind: string) =>
  document.querySelector<HTMLElement>(`[data-test="automation-step-${kind}"]`)!;

/** Fills the trigger and transformation, then opens the action. */
async function openAction() {
  const result = renderApp("/workflows/new?view=plain");
  const { user } = result;
  await user.click(await screen.findByRole("button", { name: /Select Trigger/ }));
  await user.click(
    within(await screen.findByRole("dialog")).getByRole("button", { name: /Amazon Scraper/ }),
  );
  await user.click(step("transformation"));
  await user.click(await screen.findByRole("button", { name: /Get new rows/ }));
  await user.click(screen.getByRole("button", { name: "Save transformation" }));
  await user.click(step("action"));
  return { ...result, dialog: await screen.findByRole("dialog", { name: "Send webhook" }) };
}

describe("Send webhook", () => {
  it("previews the request and switches between data and a dataset link", async () => {
    const { user, dialog } = await openAction();
    const preview = within(dialog).getByRole("figure", { name: "Request preview" });

    await user.type(
      within(dialog).getByRole("textbox", { name: "URL" }),
      "https://hooks.example.com/apify",
    );
    expect(preview).toHaveTextContent("POST https://hooks.example.com/apify");
    expect(preview).toHaveTextContent('"dataset"');
    expect(preview).toHaveTextContent('"sizeBytes"');
    expect(preview).not.toHaveTextContent('"data"');

    await user.click(within(dialog).getByRole("checkbox", { name: "Include data in the payload" }));
    expect(preview).toHaveTextContent('"data"');
    // The rows come from the transformation (Get new rows → the laptop sleeve).
    expect(preview).toHaveTextContent("Laptop sleeve");
    expect(preview).not.toHaveTextContent('"dataset"');
  });

  it("adds authentication with the secret masked in the preview", async () => {
    const { user, dialog } = await openAction();
    const preview = within(dialog).getByRole("figure", { name: "Request preview" });
    await user.type(
      within(dialog).getByRole("textbox", { name: "URL" }),
      "https://hooks.example.com/apify",
    );

    await user.selectOptions(
      within(dialog).getByRole("combobox", { name: "Authentication" }),
      "header",
    );
    const save = within(dialog).getByRole("button", { name: "Save action" });
    expect(save).toBeDisabled();
    await user.type(within(dialog).getByLabelText("Header value"), "my-very-secret-key");
    expect(preview).toHaveTextContent("X-Api-Key: ••••••••-key");
    expect(preview).not.toHaveTextContent("my-very-secret-key");
    expect(save).toBeEnabled();

    await user.click(save);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(step("action")).toHaveTextContent("Send webhook");
    expect(step("action")).toHaveTextContent("hooks.example.com/apify · dataset link");
  });

  it("rejects an invalid URL", async () => {
    const { user, dialog } = await openAction();
    const url = within(dialog).getByRole("textbox", { name: "URL" });
    await user.type(url, "not a url");
    await user.tab();
    expect(within(dialog).getByText(/Enter a valid URL/)).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Save action" })).toBeDisabled();
  });

  it("skips empty results by default", async () => {
    const { dialog } = await openAction();
    expect(
      within(dialog).getByRole("checkbox", { name: "Skip when there are no rows" }),
    ).toBeChecked();
  });

  it("sends a test request and shows the response", async () => {
    const { user, dialog } = await openAction();
    const send = within(dialog).getByRole("button", { name: "Send test request" });
    expect(send).toBeDisabled();
    await user.type(
      within(dialog).getByRole("textbox", { name: "URL" }),
      "https://hooks.example.com/apify",
    );
    await user.click(within(dialog).getByRole("button", { name: "Send test request" }));
    expect(await within(dialog).findByText("200 OK")).toBeInTheDocument();

    await user.clear(within(dialog).getByRole("textbox", { name: "URL" }));
    await user.type(within(dialog).getByRole("textbox", { name: "URL" }), "https://down.invalid");
    await user.click(within(dialog).getByRole("button", { name: "Send test request" }));
    expect(await within(dialog).findByText("Could not resolve host")).toBeInTheDocument();
  });

  it("limits the payload size when data is included", async () => {
    const { user, dialog } = await openAction();
    await user.type(
      within(dialog).getByRole("textbox", { name: "URL" }),
      "https://hooks.example.com/apify",
    );
    expect(within(dialog).queryByRole("textbox", { name: "Size limit in MB" })).toBeNull();
    await user.click(within(dialog).getByRole("checkbox", { name: "Include data in the payload" }));

    const limit = within(dialog).getByRole("textbox", { name: "Size limit in MB" });
    expect(limit).toHaveValue("5");
    await user.clear(limit);
    await user.type(limit, "0.001");
    const preview = within(dialog).getByRole("figure", { name: "Request preview" });
    expect(preview).toHaveTextContent("over the");
    expect(preview).toHaveTextContent('"dataset"');

    await user.selectOptions(
      within(dialog).getByRole("combobox", { name: "If the rows don't fit" }),
      "split",
    );
    expect(preview).toHaveTextContent('"batch"');

    await user.clear(limit);
    expect(within(dialog).getByRole("button", { name: "Save action" })).toBeDisabled();
  });

  it("configures optional failure handling", async () => {
    const { user, dialog } = await openAction();
    const toggle = within(dialog).getByRole("button", { name: /Failure handling/ });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveTextContent("a failed request isn't retried");
    await user.click(toggle);
    await user.click(within(dialog).getByRole("checkbox", { name: "Retry failed requests" }));
    await user.selectOptions(within(dialog).getByRole("combobox", { name: "Retries" }), "5");
    expect(toggle).toHaveTextContent("5 retries, 30 s timeout, email on failure");
    expect(within(dialog).getByRole("textbox", { name: "Notification email" })).toHaveValue(
      "martin@hummock.example",
    );
    await user.click(
      within(dialog).getByRole("checkbox", { name: "Email me when all retries fail" }),
    );
    expect(toggle).toHaveTextContent("5 retries, 30 s timeout");
    expect(toggle).not.toHaveTextContent("email");
  });

  it("offers a signing secret", async () => {
    const { user, dialog } = await openAction();
    await user.selectOptions(
      within(dialog).getByRole("combobox", { name: "Authentication" }),
      "signature",
    );
    await user.click(within(dialog).getByRole("button", { name: "Generate" }));
    const secret = within(dialog).getByLabelText<HTMLInputElement>("Signing secret");
    expect(secret.value).toMatch(/^whsec_\w{32}$/);
    expect(within(dialog).getByRole("figure", { name: "Request preview" })).toHaveTextContent(
      "X-Apify-Signature: sha256=",
    );
  });
});
