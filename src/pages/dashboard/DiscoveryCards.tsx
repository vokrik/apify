import { useState } from "react";
import { Link } from "react-router";

import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  HistoryIcon,
  McpIcon,
  SearchIcon,
} from "@/components/icons";
import { CardContainer } from "@/components/ui/CardContainer";
import { formatMonth, formatUsd } from "@/lib/format";
import { getCurrentMonthUsage } from "@/services/usage";

import { PixelChart } from "./PixelChart";

export function AiChatCard() {
  const [question, setQuestion] = useState("");
  return (
    <CardContainer
      className="h-full transition-colors duration-[120ms] focus-within:bg-neutral-separator-subtle"
      contentClassName="grid h-full grid-cols-[2.8rem_1fr_2.8rem] grid-rows-[1fr_auto] gap-1 p-2"
    >
      <span className="flex h-[2.8rem] items-center justify-center text-neutral-text-subtle">
        <SearchIcon />
      </span>
      <textarea
        aria-label="Ask Apify AI"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Which Actor is best for Instagram posts?"
        rows={2}
        className="col-span-2 resize-none bg-transparent py-1 text-sm text-neutral-text outline-none placeholder:text-neutral-text-placeholder"
      />
      <button
        type="button"
        aria-label="Conversation history"
        className="flex size-[2.8rem] cursor-pointer items-center justify-center self-end rounded-sm text-neutral-text hover:bg-neutral-hover"
      >
        <HistoryIcon />
      </button>
      <span />
      <button
        type="submit"
        aria-label="Ask"
        disabled={!question.trim()}
        className="flex size-[2.8rem] cursor-pointer items-center justify-center self-end rounded-sm bg-primary-action text-neutral-text-on-primary disabled:cursor-default disabled:bg-neutral-disabled disabled:text-neutral-text-disabled"
      >
        <ArrowRightIcon className="size-3" />
      </button>
    </CardContainer>
  );
}

export function UsageCard() {
  const usage = getCurrentMonthUsage();
  return (
    <Link to="/billing" className="block h-[10.8rem] max-w-[40rem] overflow-hidden">
      <CardContainer className="h-full" contentClassName="flex gap-4 overflow-hidden p-2">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
          <div className="flex flex-col gap-1">
            <p className="truncate text-xs font-medium text-neutral-text">Usage</p>
            <p className="truncate text-xs text-neutral-text-subtle">{formatMonth(usage.month)}</p>
          </div>
          <p className="text-[3rem] leading-[3.2rem] font-semibold">{formatUsd(usage.totalUsd)}</p>
        </div>
        <PixelChart values={usage.daily} columns={usage.daysInMonth} />
      </CardContainer>
    </Link>
  );
}

export function McpCard() {
  return (
    <a
      href="https://mcp.apify.com"
      aria-label="Apify MCP server"
      target="_blank"
      rel="noreferrer"
      className="block h-full rounded-lg transition-colors duration-[120ms] hover:bg-neutral-separator-subtle"
    >
      <CardContainer
        className="h-full bg-transparent"
        contentClassName="flex flex-col gap-2 px-3 py-2"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs font-medium text-neutral-text-muted">
            <McpIcon />
            Apify MCP server
          </span>
          <ArrowUpRightIcon className="size-4 text-neutral-text" />
        </div>
        <p className="text-sm font-medium">Run Actors from Claude, Cursor, or any MCP client.</p>
      </CardContainer>
    </a>
  );
}
