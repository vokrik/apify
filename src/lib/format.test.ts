import { describe, expect, it } from "vitest";

import {
  durationParts,
  formatDateTime,
  formatNumber,
  formatUsd,
  truncateMiddle,
  formatBytes,
} from "./format";

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

describe("formatBytes", () => {
  it("uses binary units", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(144375)).toBe("141 KB");
    expect(formatBytes(5 * 1024 * 1024)).toBe("5 MB");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });
});
