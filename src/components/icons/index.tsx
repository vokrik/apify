// Icons extracted verbatim from the Apify Console markup (reference/console/).
// Generated once from the saved page; edit by hand when adding new icons.
// All are 20x20 icons using currentColor; size them with Tailwind (default size-4 = 16px).

import type { ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

function createIcon(name: string, paths: ReactNode, rootProps: IconProps = {}) {
  function Icon({ className = "size-4 shrink-0", ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
        aria-hidden="true"
        className={className}
        {...rootProps}
        {...props}
      >
        {paths}
      </svg>
    );
  }
  Icon.displayName = `${name}Icon`;
  return Icon;
}

export const ChevronDownIcon = createIcon(
  "ChevronDown",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="m5 7.5 5 5 5-5"
    />
  </>,
);

export const SearchIcon = createIcon(
  "Search",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M2.5 8.333a5.834 5.834 0 1 0 11.667 0 5.834 5.834 0 0 0-11.667 0M17.5 17.5l-5-5"
    />
  </>,
);

export const CommandIcon = createIcon(
  "Command",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M5.833 7.5A1.667 1.667 0 1 1 7.5 5.833v8.333a1.667 1.667 0 1 1-1.667-1.667h8.333a1.667 1.667 0 1 1-1.667 1.667V5.833A1.667 1.667 0 1 1 14.166 7.5z"
    />
  </>,
);

export const BellIcon = createIcon(
  "Bell",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M8.333 4.167a1.667 1.667 0 1 1 3.333 0 5.83 5.83 0 0 1 3.334 5v2.5a3.33 3.33 0 0 0 1.666 2.5H3.333A3.33 3.33 0 0 0 5 11.667v-2.5a5.83 5.83 0 0 1 3.333-5M7.5 14.167V15a2.5 2.5 0 0 0 5 0v-.833"
    />
  </>,
);

export const StoreIcon = createIcon(
  "Store",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M5.276 6.667h9.449a1.667 1.667 0 0 1 1.647 1.92l-1.045 6.793a2.5 2.5 0 0 1-2.472 2.12h-5.71a2.5 2.5 0 0 1-2.47-2.12L3.627 8.587a1.667 1.667 0 0 1 1.648-1.92"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M7.5 9.167V5a2.5 2.5 0 1 1 5 0v4.167"
    />
  </>,
);

export const DashboardIcon = createIcon(
  "Dashboard",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M4.167 10H2.5L10 2.5l7.5 7.5h-1.667M4.167 10v5.833A1.666 1.666 0 0 0 5.834 17.5h8.333a1.667 1.667 0 0 0 1.667-1.667V10"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M7.5 17.5v-5a1.667 1.667 0 0 1 1.667-1.667h1.666A1.667 1.667 0 0 1 12.5 12.5v5"
    />
  </>,
);

export const ActorsIcon = createIcon(
  "Actors",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M5.833 6.667 2.5 10l3.333 3.333M14.167 6.667 17.5 10l-3.333 3.333M11.667 3.333 8.333 16.667"
    />
  </>,
);

export const RunsIcon = createIcon(
  "Runs",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M5.833 3.333v13.334L16.667 10z"
    />
  </>,
);

export const TasksIcon = createIcon(
  "Tasks",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M11.667 2.5v3.333a.834.834 0 0 0 .833.834h3.334"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M14.167 17.5H5.834a1.667 1.667 0 0 1-1.667-1.667V4.167A1.667 1.667 0 0 1 5.834 2.5h5.833l4.167 4.167v9.166a1.667 1.667 0 0 1-1.667 1.667M7.5 14.166h5M7.5 10.833h5"
    />
  </>,
);

export const IntegrationsIcon = createIcon(
  "Integrations",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M3.333 5.833h2.5A.833.833 0 0 0 6.667 5v-.833a1.667 1.667 0 1 1 3.333 0V5a.833.833 0 0 0 .833.833h2.5a.833.833 0 0 1 .834.834v2.5A.834.834 0 0 0 15 10h.833a1.666 1.666 0 1 1 0 3.333H15a.833.833 0 0 0-.833.834v2.5a.833.833 0 0 1-.834.833h-2.5a.833.833 0 0 1-.833-.833v-.834a1.667 1.667 0 0 0-3.333 0v.834a.833.833 0 0 1-.834.833h-2.5a.833.833 0 0 1-.833-.833v-2.5a.833.833 0 0 1 .833-.834h.834a1.667 1.667 0 0 0 0-3.333h-.834a.833.833 0 0 1-.833-.833v-2.5a.833.833 0 0 1 .833-.834"
    />
  </>,
);

export const SchedulesIcon = createIcon(
  "Schedules",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M2.5 10a7.5 7.5 0 1 0 15 0 7.5 7.5 0 0 0-15 0"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M10 5.833V10l2.5 2.5"
    />
  </>,
);

export const MyActorsIcon = createIcon(
  "MyActors",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M12.083 3.333h2.083a2.5 2.5 0 0 1 2.5 2.5v8.334a2.5 2.5 0 0 1-2.5 2.5H5.833a2.5 2.5 0 0 1-2.5-2.5V10M5 4.167 3.333 5.833 5 7.5"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M8.333 7.5 10 5.833 8.333 4.167"
    />
  </>,
);

export const InsightsIcon = createIcon(
  "Insights",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M3.333 3.334h13.333v1.81c0 .442-.175.866-.488 1.178L12.5 10v5.834l-5 1.666v-7.083L3.766 6.31a1.67 1.67 0 0 1-.433-1.12z"
    />
  </>,
);

export const MessagingIcon = createIcon(
  "Messaging",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="m2.5 16.667 1.083-3.25c-1.936-2.864-1.188-6.56 1.75-8.645 2.939-2.084 7.159-1.914 9.871.4s3.08 6.055.858 8.75c-2.222 2.697-6.346 3.513-9.645 1.912z"
    />
  </>,
);

export const ProxyIcon = createIcon(
  "Proxy",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M2.5 10a7.5 7.5 0 1 0 15 0 7.5 7.5 0 0 0-15 0M3 7.5h14M3 12.5h14"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M9.583 2.5a14.17 14.17 0 0 0 0 15M10.417 2.5a14.17 14.17 0 0 1 0 15"
    />
  </>,
);

export const StorageIcon = createIcon(
  "Storage",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M3.333 5c0 .663.702 1.299 1.953 1.768 1.25.469 2.946.732 4.714.732s3.464-.263 4.714-.732c1.25-.47 1.952-1.105 1.952-1.768s-.702-1.299-1.952-1.768S11.768 2.5 10 2.5s-3.464.263-4.714.732C4.036 3.702 3.333 4.337 3.333 5"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M3.333 5v5c0 .663.702 1.299 1.953 1.768 1.25.469 2.946.732 4.714.732s3.464-.263 4.714-.732c1.25-.47 1.952-1.105 1.952-1.768V5"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M3.333 10v5c0 .663.702 1.299 1.953 1.768 1.25.469 2.946.732 4.714.732s3.464-.263 4.714-.732c1.25-.47 1.952-1.105 1.952-1.768v-5"
    />
  </>,
);

export const BillingIcon = createIcon(
  "Billing",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M2.5 6.667a2.5 2.5 0 0 1 2.5-2.5h10a2.5 2.5 0 0 1 2.5 2.5v6.666a2.5 2.5 0 0 1-2.5 2.5H5a2.5 2.5 0 0 1-2.5-2.5zM2.5 8.333h15M5.833 12.5h.008M9.167 12.5h1.667"
    />
  </>,
);

export const SettingsIcon = createIcon(
  "Settings",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M8.604 3.598c.355-1.464 2.437-1.464 2.792 0a1.437 1.437 0 0 0 2.144.888c1.286-.783 2.758.688 1.975 1.975a1.436 1.436 0 0 0 .887 2.143c1.464.355 1.464 2.437 0 2.792a1.437 1.437 0 0 0-.888 2.144c.784 1.286-.688 2.758-1.975 1.975a1.436 1.436 0 0 0-2.143.887c-.355 1.464-2.437 1.464-2.792 0a1.437 1.437 0 0 0-2.144-.888c-1.286.784-2.758-.688-1.975-1.975a1.437 1.437 0 0 0-.888-2.143c-1.463-.355-1.463-2.437 0-2.792a1.437 1.437 0 0 0 .889-2.144c-.783-1.286.688-2.758 1.975-1.975a1.435 1.435 0 0 0 2.143-.888"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M7.5 10a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0"
    />
  </>,
);

export const ArrowRightIcon = createIcon(
  "ArrowRight",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M4.167 10h11.667M10.833 15l5-5M10.833 5l5 5"
    />
  </>,
);

export const CloseIcon = createIcon(
  "Close",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M15 5 5 15M5 5l10 10"
    />
  </>,
);

export const CodeIcon = createIcon(
  "Code",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M5.833 6.667 2.5 10l3.333 3.333M14.167 6.667 17.5 10l-3.333 3.333M11.667 3.333 8.333 16.667"
    />
  </>,
);

export const HelpIcon = createIcon(
  "Help",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M2.5 10a7.5 7.5 0 1 0 15 0 7.5 7.5 0 0 0-15 0M10 13.333v.009"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M10 10.833a1.667 1.667 0 1 0-.314-3.3 1.65 1.65 0 0 0-.936.551"
    />
  </>,
);

export const ChevronsLeftIcon = createIcon(
  "ChevronsLeft",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M15 5.833 10.833 10 15 14.167M10 5.833 5.833 10 10 14.167"
    />
  </>,
);

export const ResearchMarketsIcon = createIcon(
  "ResearchMarkets",
  <>
    <path d="M3.333 13.333a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0M11.667 13.333a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0M13.622 7.642l-.608-1.051c-.133-.207-.88-.17-.93.076l-.148 1.15" />
    <path d="M16.468 12.344 14.1 8.067c-.158-.259-.493-.567-1.184-.567-.69 0-1.25.373-1.25.833v5M6.378 7.642l.608-1.051c.133-.208.88-.17.93.076l.148 1.15" />
    <path d="m3.533 12.344 2.366-4.277c.158-.259.493-.567 1.184-.567.69 0 1.25.373 1.25.833v5M8.333 10h3.334v1.667H8.333z" />
  </>,
  { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.389" },
);

export const CollectContentIcon = createIcon(
  "CollectContent",
  <>
    <path d="M2.5 5a1.667 1.667 0 0 1 1.667-1.667h11.666A1.667 1.667 0 0 1 17.5 5a1.667 1.667 0 0 1-1.667 1.667H4.167A1.667 1.667 0 0 1 2.5 5M4.167 6.667V15a1.667 1.667 0 0 0 1.666 1.667h8.334A1.667 1.667 0 0 0 15.833 15V6.667M8.333 10h3.334" />
  </>,
  { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.667" },
);

export const GenerateLeadsIcon = createIcon(
  "GenerateLeads",
  <>
    <path d="M9.167 10a.833.833 0 1 0 1.666 0 .833.833 0 1 0-1.666 0" />
    <path d="M5.833 10a4.167 4.167 0 1 0 8.334 0 4.167 4.167 0 1 0-8.334 0" />
    <path d="M2.5 10a7.5 7.5 0 1 0 15 0 7.5 7.5 0 1 0-15 0" />
  </>,
  { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.667" },
);

export const TrackProductsIcon = createIcon(
  "TrackProducts",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M5.276 6.667h9.449a1.667 1.667 0 0 1 1.647 1.92l-1.045 6.793a2.5 2.5 0 0 1-2.472 2.12h-5.71a2.5 2.5 0 0 1-2.47-2.12L3.627 8.587a1.667 1.667 0 0 1 1.648-1.92"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M7.5 9.167V5a2.5 2.5 0 1 1 5 0v4.167"
    />
  </>,
);

export const DeveloperToolsIcon = createIcon(
  "DeveloperTools",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M5.833 6.667 2.5 10l3.333 3.333M14.167 6.667 17.5 10l-3.333 3.333M11.667 3.333 8.333 16.667"
    />
  </>,
);

export const BrandMonitoringIcon = createIcon(
  "BrandMonitoring",
  <>
    <path d="M14.167 14.167V3.333L10 5.833l-4.167-2.5v10.834l4.167 2.5z" />
  </>,
  { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.667" },
);

export const AnalyzeSeoIcon = createIcon(
  "AnalyzeSeo",
  <>
    <path d="M3.333 15.833h13.334M3.333 12.5l3.334-5L10 9.167 13.333 5l3.334 3.333" />
  </>,
  { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.667" },
);

export const GetProfilesIcon = createIcon(
  "GetProfiles",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.67"
      d="M6.667 5.833a3.333 3.333 0 1 0 6.666 0 3.333 3.333 0 0 0-6.666 0M5 17.5v-1.667A3.333 3.333 0 0 1 8.333 12.5h3.334A3.333 3.333 0 0 1 15 15.833V17.5"
    />
  </>,
);

export const GetCompanyDataIcon = createIcon(
  "GetCompanyData",
  <>
    <path d="M7.5 4.167H5.833a1.667 1.667 0 0 0-1.666 1.666v10A1.667 1.667 0 0 0 5.833 17.5h8.334a1.667 1.667 0 0 0 1.666-1.667v-10a1.667 1.667 0 0 0-1.666-1.666H12.5" />
    <path d="M7.5 4.167A1.667 1.667 0 0 1 9.167 2.5h1.666A1.667 1.667 0 0 1 12.5 4.167a1.667 1.667 0 0 1-1.667 1.666H9.167A1.667 1.667 0 0 1 7.5 4.167M7.5 14.167v-3.334M10 14.167v-.834M12.5 14.167V12.5M10 14.167v-.834" />
  </>,
  { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.667" },
);

export const GetContactDetailsIcon = createIcon(
  "GetContactDetails",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M2.5 5.834a1.667 1.667 0 0 1 1.667-1.667h11.666A1.666 1.666 0 0 1 17.5 5.834v8.333a1.667 1.667 0 0 1-1.667 1.667H4.167A1.667 1.667 0 0 1 2.5 14.167z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="m2.5 5.833 7.5 5 7.5-5"
    />
  </>,
);

export const PlusIcon = createIcon(
  "Plus",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M10 4.167v11.666M4.167 10h11.666"
    />
  </>,
);

export const UsersIcon = createIcon(
  "Users",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M4.167 5.833a3.333 3.333 0 1 0 6.666 0 3.333 3.333 0 0 0-6.666 0M2.5 17.5v-1.667A3.333 3.333 0 0 1 5.833 12.5h3.334a3.333 3.333 0 0 1 3.333 3.333V17.5M13.333 2.608a3.333 3.333 0 0 1 0 6.459M17.5 17.5v-1.666a3.33 3.33 0 0 0-2.5-3.209"
    />
  </>,
);

export const StarIcon = createIcon(
  "Star",
  <>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="m10 14.792-5.143 2.704.982-5.728-4.167-4.056 5.75-.833 2.572-5.21 2.572 5.21 5.75.834-4.167 4.055.983 5.728z"
    />
  </>,
);

// ---------------------------------------------------------------------------------------------
// Icons below are NOT in the saved reference markup yet. Apify's icon set is derived from Tabler
// Icons (24px grid, 2px stroke ≈ Apify's 20px grid with 1.667 stroke), so these use the matching
// Tabler outline paths. Replace them with the verbatim Apify SVG once a reference page has them.
// ---------------------------------------------------------------------------------------------

const tabler: IconProps = {
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const SparklesIcon = createIcon(
  "Sparkles",
  <path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" />,
  tabler,
);

export const HistoryIcon = createIcon(
  "History",
  <path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969M14 3.223a9.003 9.003 0 0 1 0 17.554M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356M12 8v4l2 2" />,
  tabler,
);

export const ArrowUpRightIcon = createIcon(
  "ArrowUpRight",
  <path d="M17 7l-10 10M8 7l9 0l0 9" />,
  tabler,
);

export const CheckIcon = createIcon("Check", <path d="M5 12l5 5l10 -10" />, tabler);

export const SquareIcon = createIcon(
  "Square",
  <path d="M5 7a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />,
  tabler,
);

export const LockIcon = createIcon(
  "Lock",
  <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6zM11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0M8 11v-4a4 4 0 1 1 8 0v4" />,
  tabler,
);

/** Model Context Protocol mark (approximation of the official logo). */
export const McpIcon = createIcon(
  "Mcp",
  <path d="M3.5 11.5l8.2 -8.2a2.8 2.8 0 0 1 4 4l-6.2 6.2M9.6 13.4l6.1 -6.1a2.8 2.8 0 0 1 4 4l-7.4 7.4a.9 .9 0 0 0 0 1.3l1.4 1.4M13.7 5.3l-6.1 6.1a2.8 2.8 0 0 0 4 4l6.1 -6.1" />,
  tabler,
);

/** Workflows (Tabler "sitemap"). */
export const WorkflowsIcon = createIcon(
  "Workflows",
  <path d="M3 17a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2zM15 17a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2zM9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2zM6 15v-1a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v1M12 9l0 3" />,
  tabler,
);

export const ChevronLeftIcon = createIcon("ChevronLeft", <path d="M15 6l-6 6l6 6" />, tabler);

export const ChevronRightIcon = createIcon("ChevronRight", <path d="M9 6l6 6l-6 6" />, tabler);

/** Sortable column (Tabler "arrows-down-up"). */
export const SortIcon = createIcon(
  "Sort",
  <path d="M17 3l0 18M10 18l-3 3l-3 -3M7 21l0 -18M20 6l-3 -3l-3 3" />,
  tabler,
);

export const ArrowDownIcon = createIcon(
  "ArrowDown",
  <path d="M12 5l0 14M18 13l-6 6M6 13l6 6" />,
  tabler,
);

export const ArrowUpIcon = createIcon(
  "ArrowUp",
  <path d="M12 5l0 14M18 11l-6 -6M6 11l6 -6" />,
  tabler,
);

export const ArrowLeftIcon = createIcon(
  "ArrowLeft",
  <path d="M5 12l14 0M5 12l6 6M5 12l6 -6" />,
  tabler,
);

/** Actor cube shown on canvas nodes (Tabler "box"). */
export const CubeIcon = createIcon(
  "Cube",
  <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5M12 12l8 -4.5M12 12l0 9M12 12l-8 -4.5" />,
  tabler,
);

export const FilterIcon = createIcon(
  "Filter",
  <path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" />,
  tabler,
);

export const WebhookIcon = createIcon(
  "Webhook",
  <path d="M4.876 13.61a4 4 0 1 0 6.124 3.39h6M15.066 20.502a4 4 0 1 0 1.934 -7.502c-.706 0 -1.424 .179 -2 .5l-3 -5.5M16 8a4 4 0 1 0 -8 0c0 1.506 .77 2.818 2 3.5l-3 5.5" />,
  tabler,
);
