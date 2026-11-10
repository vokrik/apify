import { StoreIcon } from "@/components/icons";

export function HelloPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4 rounded-lg border border-neutral-border bg-neutral-card-background p-8 shadow-2">
        <img src="/logo-apify-dark-theme.svg" alt="Apify" className="h-6" />
        <h1 className="text-2xl font-semibold">Hello, Apify Console</h1>
        <p className="flex items-center gap-2 text-neutral-text-muted">
          <StoreIcon className="size-5 text-primary-icon" />
          Prototype scaffold is up and running.
        </p>
      </div>
    </main>
  );
}
