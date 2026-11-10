import type { ReactNode } from "react";

export type PageHeaderProps = {
  title: string;
  actions?: ReactNode;
};

/** Apify `PageHeader` (dashboard variant: no border, 3.2rem top / 2.4rem side padding). */
export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <header className="px-6 pt-8 pb-2">
      <div className="flex items-center justify-between self-stretch">
        <div className="flex h-[3.2rem] items-center gap-1">
          <h1 className="text-xl leading-[2.4rem] font-strong">{title}</h1>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </header>
  );
}
