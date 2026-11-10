import { Outlet } from "react-router";

import { Sidebar } from "./Sidebar";

/** Apify `main_layout`: sticky full-height sidebar + scrolling main column. */
export function AppLayout() {
  return (
    <div className="flex min-w-[768px]">
      <header className="sticky top-0 left-0 z-[102] flex-none self-start">
        <Sidebar />
      </header>
      <main data-test="main-content" className="min-w-0 flex-1">
        <div className="min-h-[calc(100vh-60px)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
