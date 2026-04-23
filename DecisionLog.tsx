import { useState } from "react";
import { useDisruption } from "@/context/DisruptionContext";
import { getScenario } from "@/data/disruptions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, ArrowUpRight, ShieldQuestion } from "lucide-react";
import { toast } from "sonner";

const statusTone = {
  Committed: "bg-gold/20 text-navy",
  "In progress": "bg-[color:var(--warning)]/20 text-[color:oklch(0.45_0.15_75)]",
  Resolved: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
};

export function DecisionLog() {
  const { decisions, resolveDecision, disruption } = useDisruption();
  const [memoFor, setMemoFor] = useState<string | null>(null);

  const memoEntry = decisions.find((d) => d.id === memoFor) ?? null;
  const memoScenario = memoEntry ? getScenario(memoEntry.scenarioId) : null;

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-display text-base font-bold text-navy">Decisions in flight</h3>
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Governance-only audit trail
        </span>
      </div>

      {decisions.length === 0 ? (
        <div className="flex items-center gap-2 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
          <ShieldQuestion className="h-4 w-4 text-gold" />
          No committed responses yet. Open the Response Playbook to choose a scenario.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {decisions.map((d) => {
            const sc = getScenario(d.scenarioId);
            return (
              <li key={d.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-display font-bold uppercase tracking-wider ${statusTone[d.status]}`}>
                      {d.status}
                    </span>
                    <span className="truncate font-display text-sm font-bold text-navy">
                      {sc?.name ?? d.scenarioId}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <span>By <strong className="text-foreground">{d.decidedBy}</strong></span>
                    <span>{new Date(d.decidedAt).toLocaleString()}</span>
                    <span>Cash {d.cash}</span>
                    <span>EBITDA {d.ebitda}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => { resolveDecision(d.id); toast.success("Status advanced"); }}
                    disabled={d.status === "Resolved"}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-display font-bold uppercase tracking-wider text-foreground hover:border-gold/60 disabled:opacity-40"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" /> Advance
                  </button>
                  <button
                    onClick={() => setMemoFor(d.id)}
                    className="inline-flex items-center gap-1 rounded-md bg-navy px-2.5 py-1.5 text-xs font-display font-bold uppercase tracking-wider text-white hover:bg-navy-deep"
                  >
                    <FileText className="h-3.5 w-3.5" /> Board memo
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={!!memoFor} onOpenChange={(o) => !o && setMemoFor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-navy">Board memo · {disruption.id}</DialogTitle>
            <DialogDescription>Auto-drafted from committed scenario data — review before circulation.</DialogDescription>
          </DialogHeader>
          {memoEntry && memoScenario && (
            <article className="space-y-3 text-sm leading-relaxed text-foreground">
              <p>
                <strong>Subject:</strong> Treasury response to {disruption.title.toLowerCase()} ({disruption.id}).
              </p>
              <p>
                On {new Date(memoEntry.decidedAt).toLocaleString()}, the Office of the CFO committed
                <strong> Scenario — {memoScenario.name}</strong> ({memoScenario.tagline}) in response to a
                {" "}{disruption.severity} disruption on the Sishen-Saldanha corridor.
              </p>
              <p>
                <strong>Expected impact:</strong> cash {memoScenario.impact.cash}, EBITDA{" "}
                {memoScenario.impact.ebitda}, Scope 1 delta {memoScenario.impact.scope1}, safety risk{" "}
                {memoScenario.impact.safety}, time-to-recover {memoScenario.impact.ttr}.
              </p>
              <p>
                <strong>Rationale:</strong> {memoScenario.description}
              </p>
              <p>
                <strong>Cross-functional actions</strong> have been routed to Mining, Logistics, Safety/HSE
                and Sustainability with named owners and SLA windows. IR has been pre-briefed and an ESG
                disclosure note is in preparation.
              </p>
              <p className="text-muted-foreground">
                — Generated by the Strategic Innovation Console
              </p>
            </article>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
