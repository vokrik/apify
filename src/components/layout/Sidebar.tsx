import { Link, NavLink } from "react-router";

import {
  ArrowRightIcon,
  BellIcon,
  ChevronDownIcon,
  ChevronsLeftIcon,
  CloseIcon,
  CodeIcon,
  CommandIcon,
  HelpIcon,
  HistoryIcon,
  SearchIcon,
} from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { accountLimits, currentUser } from "@/data/user";
import { cn } from "@/lib/cn";
import { usePersistentState } from "@/lib/usePersistentState";

import { bottomNav, developmentNav, mainNav, type NavItem } from "./navigation";

// Layout and spacing follow `sidebar__StyledSidebar` / `nav__StyledNav` from
// reference/console/store/index.html.

function SidebarDivider() {
  return <div className="h-0 w-full border-b border-neutral-separator-subtle" />;
}

function NavUserPill() {
  return (
    <button
      type="button"
      className="flex h-[4rem] w-full cursor-pointer items-start justify-between gap-2 rounded-md p-1 text-left text-neutral-text"
    >
      <span className="flex min-w-0 gap-2">
        <img
          src={currentUser.avatarUrl}
          alt={`${currentUser.username} avatar`}
          className="size-[32px] shrink-0 rounded-full"
        />
        <span className="min-w-0">
          <span
            data-test="nav-user-pill-name"
            className="block w-[100px] truncate text-xs font-medium"
          >
            {currentUser.displayName}
          </span>
          <span
            data-test="nav-user-pill-account"
            className="block text-xs text-neutral-text-subtle"
          >
            {currentUser.accountLabel}
          </span>
        </span>
      </span>
      <ChevronDownIcon className="size-4 shrink-0 [stroke-width:2px] text-neutral-text-subtle" />
    </button>
  );
}

function SearchBar() {
  return (
    <div className="flex w-full items-center gap-1">
      <button
        type="button"
        data-test="invoke-global-search-button"
        className="flex h-[28px] grow cursor-pointer items-center justify-start gap-1 rounded-sm border border-neutral-border bg-neutral-background-muted px-[5px] text-neutral-text-placeholder transition-colors hover:border-primary-field-border-active hover:bg-neutral-background"
      >
        <SearchIcon />
        <span className="grow text-left text-sm">Search...</span>
        <kbd className="inline-flex h-[20px] min-w-[20px] items-center justify-center gap-[0.2rem] rounded-xs border border-neutral-border bg-neutral-background-subtle px-1 py-[0.2rem] font-mono text-xs font-medium text-neutral-text-subtle">
          <CommandIcon className="size-3" />K
        </kbd>
      </button>
      <Button size="small" iconOnly aria-label="Notifications" className="px-[5px]">
        <BellIcon />
      </Button>
    </div>
  );
}

function SidebarLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end
      data-test={item.testId}
      className={({ isActive }) =>
        cn(
          "relative flex items-center justify-between gap-2 rounded-sm px-2 py-1 text-neutral-text hover:bg-neutral-background-subtle",
          isActive && "bg-neutral-background-subtle",
        )
      }
    >
      <Icon />
      <span
        className={cn(
          "overflow-hidden text-[1.3rem] leading-[2rem] font-medium whitespace-nowrap",
          item.badge ? "flex-[0_1_auto]" : "flex-1",
        )}
      >
        {item.label}
      </span>
      {item.badge && (
        <Badge variant={item.badge.variant} size="xsmall" className="mr-auto shrink-0 font-normal">
          {item.badge.label}
        </Badge>
      )}
    </NavLink>
  );
}

function SidebarItem({ item }: { item: NavItem }) {
  if (item.action === "conversationHistory") {
    return (
      <div className="relative rounded-sm">
        <SidebarLink item={item} />
        <div className="absolute inset-y-0 right-[0.2rem] flex items-center">
          <Button variant="ghost" size="small" iconOnly aria-label="Conversation history">
            <HistoryIcon />
          </Button>
        </div>
      </div>
    );
  }
  return <SidebarLink item={item} />;
}

function DevelopmentSection() {
  const [expanded, setExpanded] = usePersistentState("sidebar.development.expanded", true);
  return (
    <div className="rounded-sm">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 px-2 py-[0.6rem] text-neutral-text-subtle"
      >
        <span className="text-xs font-medium">Development</span>
        <ChevronDownIcon
          className={cn(
            "size-4 [stroke-width:2px] transition-transform duration-150",
            expanded && "rotate-180",
          )}
        />
      </button>
      {expanded && (
        <div className="flex flex-col gap-[0.6rem] pt-[0.6rem] pl-1">
          {developmentNav.map((item) => (
            <SidebarItem key={item.to} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function UsageBox() {
  return (
    <div className="p-2">
      <div className="flex flex-col gap-[0.6rem] p-2">
        <div
          data-test="navigation-usage"
          className="flex justify-between text-xs text-neutral-text-muted"
        >
          <Link to="/actors/runs" className="hover:text-primary-text-interactive">
            RAM
          </Link>
          <span className="flex gap-1">
            <span className="font-semibold">{accountLimits.ramUsedMb} MB</span>
            <span>/</span>
            <span>{accountLimits.ramTotalGb} GB</span>
          </span>
        </div>
        <div
          data-test="navigation-usage"
          className="flex justify-between text-xs text-neutral-text-muted"
        >
          <Link to="/billing" className="hover:text-primary-text-interactive">
            Usage
          </Link>
          <span className="flex gap-1">
            <span className="font-semibold">${accountLimits.usageUsd.toFixed(2)}</span>
            <span>/</span>
            <span>${accountLimits.usageLimitUsd.toFixed(2)}</span>
          </span>
        </div>
      </div>
      <div className="my-1 flex">
        <Button
          variant="primary"
          size="small"
          data-test="navigation-upgrade-button"
          className="flex w-full justify-between"
        >
          <span className="flex gap-1">
            <span className="text-sm font-normal">Upgrade to</span>
            <Badge variant="primary">Starter</Badge>
          </span>
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}

function CreatorPlanNotification({ onClose }: { onClose: () => void }) {
  return (
    <aside className="absolute bottom-0 left-0 z-[1] mx-[0.6rem] my-2 w-[calc(22rem-1.2rem)]">
      <section className="relative rounded-md border border-neutral-border bg-neutral-card-background p-3 text-sm shadow-1">
        <button
          type="button"
          data-test="notification-close-button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-2 right-2 cursor-pointer text-neutral-text"
        >
          <CloseIcon className="size-3" />
        </button>
        <header className="flex items-center gap-2">
          <span className="flex size-[2.4rem] items-center justify-center rounded-sm bg-neutral-background-subtle text-primary-icon">
            <CodeIcon />
          </span>
          <span className="text-sm font-semibold">Creator plan</span>
        </header>
        <p className="my-2 text-xs text-neutral-text-muted">
          For $1 per month, you get $500 worth of platform usage free.
        </p>
        <footer className="leading-[1.6rem]">
          <Link
            to="/billing"
            className="inline-flex items-center gap-1 text-neutral-text-muted transition-colors hover:text-primary-action-hover"
          >
            <span className="text-xs font-medium">Upgrade</span>
            <ArrowRightIcon />
          </Link>
        </footer>
      </section>
    </aside>
  );
}

function SidebarFooter() {
  return (
    <div className="flex flex-row items-center justify-between px-2 py-3">
      <Link
        to="/actors"
        aria-label="Apify"
        className="h-[1.6rem] w-[6rem] bg-[url(/logo-apify-dark-theme.svg)] bg-cover"
      />
      <div className="flex items-center gap-1">
        <Button size="small" iconOnly aria-label="Help & resources">
          <HelpIcon />
        </Button>
        <Button size="small" iconOnly aria-label="Toggle sidebar">
          <ChevronsLeftIcon />
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [notificationClosed, setNotificationClosed] = usePersistentState(
    "sidebar.creatorPlanNotification.closed",
    false,
  );
  return (
    <nav
      data-test="sidebar"
      aria-label="Main navigation"
      className="relative flex h-screen w-[22rem] flex-col border-r border-neutral-separator-subtle bg-neutral-background"
    >
      <div className="flex flex-col gap-2 px-2 py-3">
        <NavUserPill />
        <SearchBar />
      </div>
      <SidebarDivider />
      <div className="flex flex-1 [scrollbar-width:none] flex-col overflow-x-hidden overflow-y-auto">
        <div className="flex flex-col gap-[0.6rem] p-2">
          {mainNav.map((item) => (
            <SidebarItem key={item.to} item={item} />
          ))}
          <DevelopmentSection />
        </div>
        <div className="flex-1" />
        <div className="mb-1 flex flex-col gap-[0.6rem] p-2">
          {bottomNav.map((item) => (
            <SidebarItem key={item.to} item={item} />
          ))}
        </div>
      </div>
      <div>
        <SidebarDivider />
        <UsageBox />
        {!notificationClosed && (
          <CreatorPlanNotification onClose={() => setNotificationClosed(true)} />
        )}
      </div>
      <SidebarDivider />
      <SidebarFooter />
    </nav>
  );
}
