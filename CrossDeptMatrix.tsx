import type { DepartmentId } from "@/data/departments";
import { WhatIfSlider } from "@/components/WhatIfSlider";
import { useDisruption } from "@/context/DisruptionContext";

const matrix: { from: DepartmentId; to: DepartmentId; label: string; weight: number }[] = [
  { from: "mining", to: "operations", label: "Tonnage forecast → rail plan", weight: 1.2 },
  { from: "operations", to: "governance", label: "Demurrage exposure → treasury", weight: 1.6 },
  { from: "safety", to: "mining", label: "Critical control verification", weight: 0.8 },
  { from: "sustainability", to: "governance", label: "Scope 1 impact → ESG disclosure", weight: 0.9 },
  { from: "governance", to: "operations", label: "Capital release for slot recovery", weight: 1.1 },
  { from: "mining", to: "safety", label: "Haul-plan change notice", weight: 0.7 },
];

const labels: Record<DepartmentId, string> = {
  governance: "Governance",
  operations: "Logistics",
  mining: "Mining",
  safety: "Safety/HSE",
  sustainability: "Sustainability",
};

export function CrossDeptMatrix({ active }: { active: DepartmentId }) {
  const { recoveryDays } = useDisruption();
  const involving = matrix.filter((m) => m.from === active || m.to === active);

  return (
    <div className="space-y-3">
      <WhatIfSlider />
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm bg-amber-200">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="font-display text-base font-bold text-navy">Cross-department interactions</h3>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Involving {labels[active]}
          </span>
        </div>
        <ul className="divide-y divide-border">
          {involving.map((m, i) => {
            const isOutbound = m.from === active;
            const counterparty = isOutbound ? m.to : m.from;
            const projected = Math.round(recoveryDays * m.weight * 18); // R m
            return (
              <li key={i} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-display font-bold uppercase tracking-wider ${
                      isOutbound ? "bg-navy text-white" : "bg-gold text-navy"
                    }`}
                  >
                    {isOutbound ? "Outbound" : "Inbound"}
                  </span>
                  <span className="text-sm font-medium text-foreground">{m.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-white/70 px-2 py-0.5 text-[10px] font-display font-bold uppercase tracking-wider text-navy ring-1 ring-navy/10">
                    Projected · R {projected}m
                  </span>
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    ↔ {labels[counterparty]}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
