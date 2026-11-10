import type { ComponentType } from "react";

import {
  ActorsIcon,
  BillingIcon,
  DashboardIcon,
  InsightsIcon,
  IntegrationsIcon,
  type IconProps,
  MessagingIcon,
  MyActorsIcon,
  ProxyIcon,
  RunsIcon,
  SchedulesIcon,
  SettingsIcon,
  SparklesIcon,
  StorageIcon,
  StoreIcon,
  TasksIcon,
} from "@/components/icons";

export type NavItem = {
  label: string;
  to: string;
  icon: ComponentType<IconProps>;
  /** `data-test` attribute from the real Console. */
  testId: string;
  beta?: boolean;
};

export const mainNav: NavItem[] = [
  { label: "Apify Store", to: "/store", icon: StoreIcon, testId: "nav-store" },
  { label: "Apify AI", to: "/ai", icon: SparklesIcon, testId: "nav-ai", beta: true },
  { label: "Dashboard", to: "/", icon: DashboardIcon, testId: "nav-dashboard" },
  { label: "Actors", to: "/actors", icon: ActorsIcon, testId: "nav-actor-list" },
  { label: "Runs", to: "/actors/runs", icon: RunsIcon, testId: "nav-actor-run-list" },
  { label: "Tasks", to: "/actors/tasks", icon: TasksIcon, testId: "nav-actor-task-list" },
  {
    label: "Integrations",
    to: "/actors/integrations",
    icon: IntegrationsIcon,
    testId: "nav-integrations-list",
  },
  { label: "Schedules", to: "/schedules", icon: SchedulesIcon, testId: "nav-schedule-list" },
];

export const developmentNav: NavItem[] = [
  {
    label: "My Actors",
    to: "/actors/development",
    icon: MyActorsIcon,
    testId: "nav-actor-development",
  },
  { label: "Insights", to: "/actors/insights", icon: InsightsIcon, testId: "nav-insights" },
  { label: "Messaging", to: "/actors/messaging", icon: MessagingIcon, testId: "nav-messaging" },
];

export const bottomNav: NavItem[] = [
  { label: "Proxy", to: "/proxy", icon: ProxyIcon, testId: "nav-proxy" },
  { label: "Storage", to: "/storage", icon: StorageIcon, testId: "nav-storage-list" },
  { label: "Billing", to: "/billing", icon: BillingIcon, testId: "nav-billing" },
  { label: "Settings", to: "/settings", icon: SettingsIcon, testId: "nav-account" },
];

export const allNavItems = [...mainNav, ...developmentNav, ...bottomNav];
