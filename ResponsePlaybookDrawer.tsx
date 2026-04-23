import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { scenarios, type ScenarioId } from "@/data/disruptions";
import { useDisruption } from "@/context/DisruptionContext";
import { CheckCircle2, AlertTriangle, TrendingDown, Leaf, ShieldCheck, Timer } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResponsePlaybookDrawer({ open, onOpenChange }: Props) {
  const { scenarioId, commitScenario, disruption } = useDisruption();
  const [selected, setSelected] = useState<ScenarioId | null>(scenarioId);

  const commit = () => {
    if (!selected) return;
    commitScenario(selected);
    const sc = scenarios.find((s) => s.id === selected)!;
    toast.success(`Response committed: ${sc.name}`, {
      description: `${sc.impact.cash} cash · ${sc.impact.ebitda} EBITDA · TTR ${sc.impact.ttr}`,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <div className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
            Response Playbook · {disruption.id}
          </div>
          <SheetTitle className="font-display text-2xl text-navy">{disruption.title}</SheetTitle>
          <SheetDescription className="text-left">{disruption.detail}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {scenarios.map((s) => {
            const isSelected = selected === s.id;
            const isCommitted = scenarioId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-gold bg-gold/10 shadow-[var(--shadow-gold)]"
                    : "border-border bg-card hover:border-gold/60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-base font-bold text-navy">
                        Scenario {s.id === "absorb" ? "A" : s.id === "reroute" ? "B" : "C"} — {s.name}
                      </h4>
                      {isCommitted && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                          <CheckCircle2 className="h-3 w-3" /> Committed
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{s.tagline}</div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-foreground/85">{s.description}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  <Metric icon={<TrendingDown className="h-3.5 w-3.5" />} label="Cash" value={s.impact.cash} />
                  <Metric icon={<TrendingDown className="h-3.5 w-3.5" />} label="EBITDA" value={s.impact.ebitda} />
                  <Metric icon={<Leaf className="h-3.5 w-3.5" />} label="Scope 1" value={s.impact.scope1} />
                  <Metric icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Safety" value={s.impact.safety} />
                  <Metric icon={<Timer className="h-3.5 w-3.5" />} label="TTR" value={s.impact.ttr} />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                  <div>
                    <div className="font-display font-bold uppercase tracking-wider text-[color:var(--success)]">Pros</div>
                    <ul className="mt-1 list-inside list-disc text-foreground/80">
                      {s.pros.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="font-display font-bold uppercase tracking-wider text-destructive">Cons</div>
                    <ul className="mt-1 list-inside list-disc text-foreground/80">
                      {s.cons.map((c) => <li key={c}>{c}</li>)}
                    </ul>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="sticky bottom-0 mt-6 flex items-center justify-between gap-3 border-t border-border bg-background pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-gold" />
            Committing routes pending actions to each department.
          </div>
          <button
            onClick={commit}
            disabled={!selected}
            className="rounded-md bg-navy px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-white shadow-[var(--shadow-elegant)] transition hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            Commit response
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-2">
      <div className="flex items-center gap-1 text-[10px] font-display font-bold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-0.5 font-display text-sm font-bold text-navy">{value}</div>
    </div>
  );
}
