import { useDisruption } from "@/context/DisruptionContext";

const presets: { d: 3 | 7 | 14; label: string }[] = [
  { d: 3, label: "3 days" },
  { d: 7, label: "7 days" },
  { d: 14, label: "14 days" },
];

export function WhatIfSlider() {
  const { recoveryDays, setRecoveryDays } = useDisruption();

  // Simple linear projections for demo purposes.
  const demurrage = recoveryDays * 32; // R m
  const fcfHit = recoveryDays * 55;    // R m
  const scope1 = (recoveryDays * 0.18).toFixed(1); // %

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            What-if · Rail recovery time
          </div>
          <div className="mt-0.5 font-display text-base font-bold text-navy">
            Projected impact at <span className="text-gold">{recoveryDays} days</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {presets.map((p) => (
            <button
              key={p.d}
              onClick={() => setRecoveryDays(p.d)}
              className={`rounded-md px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider transition ${
                recoveryDays === p.d
                  ? "bg-navy text-white shadow-[var(--shadow-gold)]"
                  : "border border-border bg-background text-foreground hover:border-gold/60"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Stat label="Demurrage" value={`R ${demurrage}m`} />
        <Stat label="FCF hit" value={`−R ${fcfHit}m`} />
        <Stat label="Scope 1 delta" value={`+${scope1}%`} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-2">
      <div className="font-display text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-sm font-bold text-navy">{value}</div>
    </div>
  );
}
