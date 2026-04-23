import { ArrowDownRight, ArrowUpRight, Minus, Sparkles } from "lucide-react";
import type { Kpi } from "@/data/departments";
import { cn } from "@/lib/utils";
import { useDisruption } from "@/context/DisruptionContext";

const statusStyles: Record<Kpi["status"], string> = {
  ok: "border-l-[color:var(--success)]",
  warn: "border-l-[color:var(--warning)]",
  risk: "border-l-[color:var(--danger)]",
};

const statusBadge: Record<Kpi["status"], string> = {
  ok: "bg-[color:var(--success)]/10 text-[color:var(--success)]",
  warn: "bg-[color:var(--warning)]/15 text-[color:oklch(0.45_0.15_75)]",
  risk: "bg-destructive/10 text-destructive",
};

const statusLabel: Record<Kpi["status"], string> = {
  ok: "On track",
  warn: "Watch",
  risk: "At risk",
};

interface Props {
  kpi: Kpi;
  onOpen: (kpi: Kpi) => void;
}

export function KpiCard({ kpi, onOpen }: Props) {
  const { scenarioId } = useDisruption();
  const TrendIcon = kpi.trend === "up" ? ArrowUpRight : kpi.trend === "down" ? ArrowDownRight : Minus;
  const trendColor =
    (kpi.trend === "up" && kpi.status === "ok") || (kpi.trend === "down" && kpi.status === "ok")
      ? "text-[color:var(--success)]"
      : kpi.status === "risk"
        ? "text-destructive"
        : "text-[color:oklch(0.5_0.15_75)]";

  return (
    <button
      onClick={() => onOpen(kpi)}
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border border-border border-l-4 bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)] focus:outline-none focus:ring-2 focus:ring-ring",
        statusStyles[kpi.status]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {kpi.label}
        </span>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-display font-bold uppercase tracking-wider", statusBadge[kpi.status])}>
          {statusLabel[kpi.status]}
        </span>
      </div>
      <div className="font-display text-3xl font-bold text-navy">{kpi.value}</div>
      {scenarioId && (
        <div className="inline-flex w-fit items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-display font-bold uppercase tracking-wider text-navy ring-1 ring-gold/40">
          <Sparkles className="h-3 w-3 text-gold" /> Projected under active scenario
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center gap-1 text-sm font-medium", trendColor)}>
          <TrendIcon className="h-4 w-4" />
          {kpi.delta}
        </div>
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground/80 group-hover:text-accent">
          Details →
        </span>
      </div>
    </button>
  );
}
