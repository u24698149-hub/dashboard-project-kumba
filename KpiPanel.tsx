import { X, Clock, BookOpen, Calculator, Database } from "lucide-react";
import type { Kpi } from "@/data/departments";

interface Props {
  kpi: Kpi | null;
  onClose: () => void;
}

export function KpiPanel({ kpi, onClose }: Props) {
  if (!kpi) return null;
  const max = Math.max(...kpi.breakdown.map((b) => Math.abs(b.value)), 1);

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-card shadow-[var(--shadow-elegant)] animate-in slide-in-from-right">
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-border bg-[var(--gradient-hero)] px-6 py-5 text-primary-foreground">
          <div>
            <div className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-gold-soft">
              KPI Detail
            </div>
            <h3 className="mt-1 font-display text-xl font-bold text-white">{kpi.label}</h3>
            <div className="mt-1 text-2xl font-display font-bold text-gold">{kpi.value}</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <Section icon={<BookOpen className="h-4 w-4" />} title="Definition">
            <p>{kpi.definition}</p>
          </Section>

          <Section icon={<Calculator className="h-4 w-4" />} title="Formula">
            <code className="block rounded-md bg-muted px-3 py-2 font-mono text-xs text-foreground">
              {kpi.formula}
            </code>
          </Section>

          <Section icon={<Database className="h-4 w-4" />} title="Source">
            <p>{kpi.source}</p>
          </Section>

          <div>
            <h4 className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Breakdown
            </h4>
            <ul className="space-y-2">
              {kpi.breakdown.map((b) => {
                const pct = (Math.abs(b.value) / max) * 100;
                return (
                  <li key={b.label} className="rounded-md border border-border bg-background p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{b.label}</span>
                      <span className="font-display font-bold text-navy">
                        {b.value} <span className="ml-2 text-xs text-muted-foreground">{b.share}</span>
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-[var(--gradient-gold)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Last updated: <strong className="text-foreground">{kpi.updated}</strong></span>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-1.5 flex items-center gap-1.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {icon}
        {title}
      </h4>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}
