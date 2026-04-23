import { useDisruption } from "@/context/DisruptionContext";
import { getFrontlineRole } from "@/data/frontline";
import { Radio, Check, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

const sevTone: Record<string, string> = {
  Low: "bg-navy/10 text-navy",
  Medium: "bg-[color:var(--warning)]/25 text-[color:oklch(0.45_0.15_75)]",
  HiPo: "bg-[color:var(--danger)]/15 text-[color:var(--danger)]",
};

export function FieldSignalsStrip() {
  const { fieldReports, ackFieldReport, convertFieldReport } = useDisruption();
  const recent = fieldReports.slice(0, 10);

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-gold" />
          <h3 className="font-display text-base font-bold text-navy">Field signals</h3>
        </div>
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Live from frontline · {recent.length} signal{recent.length === 1 ? "" : "s"}
        </span>
      </div>

      {recent.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
          No field reports yet. Switch to Frontline mode and file one to see it appear here.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {recent.map((r) => {
            const role = getFrontlineRole(r.role);
            return (
              <li key={r.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-display font-bold uppercase tracking-wider ${sevTone[r.severity]}`}>
                      {r.severity}
                    </span>
                    <span className="font-display text-sm font-bold text-navy">{r.kind}</span>
                    {r.converted && (
                      <span className="rounded-full bg-[var(--success)]/15 px-2 py-0.5 text-[10px] font-display font-bold uppercase tracking-wider text-[color:var(--success)]">
                        Converted
                      </span>
                    )}
                    {r.ack && !r.converted && (
                      <span className="rounded-full bg-navy/10 px-2 py-0.5 text-[10px] font-display font-bold uppercase tracking-wider text-navy">
                        Acknowledged
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <span>{role.name}</span>
                    <span>{r.where}</span>
                    <span>{new Date(r.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  {r.note && <div className="mt-1 text-sm text-foreground">"{r.note}"</div>}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => { ackFieldReport(r.id); toast.success("Acknowledged"); }}
                    disabled={r.ack}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-display font-bold uppercase tracking-wider text-foreground hover:border-gold/60 disabled:opacity-40"
                  >
                    <Check className="h-3.5 w-3.5" /> Ack
                  </button>
                  <button
                    onClick={() => { convertFieldReport(r.id); toast.success("Converted to action", { description: `Routed to ${role.dept}` }); }}
                    disabled={r.converted}
                    className="inline-flex items-center gap-1 rounded-md bg-navy px-2.5 py-1.5 text-xs font-display font-bold uppercase tracking-wider text-white hover:bg-navy-deep disabled:opacity-40"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" /> Convert
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
