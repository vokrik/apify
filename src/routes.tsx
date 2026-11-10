import type { RouteObject } from "react-router";

import { HelloPage } from "@/pages/HelloPage";

// Route table shared by the app (browser router) and tests (memory router).
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HelloPage />,
  },
];
