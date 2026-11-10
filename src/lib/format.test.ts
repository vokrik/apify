import { describe, expect, it } from "vitest";

import { durationParts, formatDateTime, formatNumber, formatUsd, truncateMiddle } from "./format";

describe("format", () => {
  it("formats date time like the Console", () => {
    expect(formatDateTime("2026-11-10T15:43:54")).toBe("2026-11-10 15:43:54");
  });

  it("splits durations into the two most significant parts", () => {
    expect(durationParts(51 * 60 + 31)).toEqual([
      { value: 51, unit: "m" },
      { value: 31, unit: "s" },
    ]);
    expect(durationParts(27)).toEqual([{ value: 27, unit: "s" }]);
    expect(durationParts(0)).toEqual([{ value: 0, unit: "s" }]);
  });

  it("formats numbers and money", () => {
    expect(formatNumber(10020)).toBe("10,020");
    expect(formatUsd(0.57)).toBe("$0.57");
  });

  it("truncates long names in the middle", () => {
    expect(truncateMiddle("understandable_hummock/amazon-scraper")).toBe("underst...scraper");
    expect(truncateMiddle("apify/web")).toBe("apify/web");
  });
});
