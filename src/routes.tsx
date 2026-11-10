import type { RouteObject } from "react-router";

import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { AutomationEditorPage } from "@/pages/workflows/editor/AutomationEditorPage";
import { WorkflowsPage } from "@/pages/workflows/WorkflowsPage";

// Route table shared by the app (browser router) and tests (memory router).
export const routes: RouteObject[] = [
  // Full-screen editors render outside the sidebar layout.
  { path: "workflows/new", element: <AutomationEditorPage /> },
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "workflows", element: <WorkflowsPage /> },
      { path: "*", element: <PlaceholderPage /> },
    ],
  },
];
