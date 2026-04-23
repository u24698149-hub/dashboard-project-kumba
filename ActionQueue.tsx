import { useDisruption } from "@/context/DisruptionContext";
import { pendingActionsByDept } from "@/data/disruptions";
import type { DepartmentId } from "@/data/departments";
import { Check, ArrowUpRight, UserCog, Clock3 } from "lucide-react";
import { toast } from "sonner";

interface Props { dept: DepartmentId }

const statusTone = {
  pending: "bg-muted text-foreground",
  ack: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
  reassigned: "bg-gold/20 text-navy",
  escalated: "bg-destructive/15 text-destructive",
};

const statusLabel = {
  pending: "Pending",
  ack: "Acknowledged",
  reassigned: "Reassigned",
  escalated: "Escalated",
};

export function ActionQueue({ dept }: Props) {
  const { actionStatus, setActionStatus, scenarioId } = useDisruption();
  const actions = pendingActionsByDept[dept] ?? [];

  if (actions.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-display text-base font-bold text-navy">Pending actions</h3>
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {scenarioId ? "Routed by committed scenario" : "Awaiting scenario commit"}
        </span>
      </div>
      <ul className="divide-y divide-border">
        {actions.map((a) => {
          const status = actionStatus[a.id] ?? "pending";
          return (
            <li key={a.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-display font-bold uppercase tracking-wider ${statusTone[status]}`}>
                    {statusLabel[status]}
                  </span>
                  <span className="truncate text-sm font-medium text-foreground">{a.title}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <span>Owner · <strong className="text-foreground">{a.owner}</strong></span>
                  <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" /> {a.due}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  onClick={() => { setActionStatus(a.id, "ack", dept); toast.success("Action acknowledged"); }}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-display font-bold uppercase tracking-wider text-foreground hover:border-gold/60"
                >
                  <Check className="h-3.5 w-3.5" /> Ack
                </button>
                <button
                  onClick={() => { setActionStatus(a.id, "reassigned", dept); toast("Action reassigned"); }}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-display font-bold uppercase tracking-wider text-foreground hover:border-gold/60"
                >
                  <UserCog className="h-3.5 w-3.5" /> Reassign
                </button>
                <button
                  onClick={() => { setActionStatus(a.id, "escalated", dept); toast.error("Escalated to Governance"); }}
                  className="inline-flex items-center gap-1 rounded-md bg-destructive px-2.5 py-1.5 text-xs font-display font-bold uppercase tracking-wider text-white hover:opacity-90"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" /> Escalate
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
