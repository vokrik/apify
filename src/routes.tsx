import type { RouteObject } from "react-router";

import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

// Route table shared by the app (browser router) and tests (memory router).
export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "*", element: <PlaceholderPage /> },
    ],
  },
];
