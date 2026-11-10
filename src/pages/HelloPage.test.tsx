import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderApp } from "@/test/render";

describe("HelloPage", () => {
  it("renders on the root route", async () => {
    renderApp("/");
    expect(
      await screen.findByRole("heading", { name: "Hello, Apify Console" }),
    ).toBeInTheDocument();
  });
});
