import { useState } from "react";
import { Check, Flag } from "lucide-react";
import { baselineBriefs, getFrontlineRole, type FrontlineRoleId } from "@/data/frontline";
import { toast } from "sonner";

export function MyShiftCard({ roleId }: { roleId: FrontlineRoleId }) {
  const role = getFrontlineRole(roleId);
  const brief = baselineBriefs[roleId];
  const [verified, setVerified] = useState<Record<string, "ok" | "flag" | undefined>>({});

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
        My shift · {role.shift}
      </div>
      <h2 className="mt-1 font-display text-2xl font-bold text-navy">{role.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{role.location}</p>

      <div className="mt-4 rounded-lg bg-navy/95 p-4 text-white">
        <div className="font-display text-base font-bold">{brief.headline}</div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {brief.metric.map((m) => (
            <div key={m.label}>
              <div className="text-[10px] uppercase tracking-wider text-white/60">{m.label}</div>
              <div className="mt-0.5 font-display text-lg font-bold text-gold">{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 font-display text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Critical controls · one tap
        </div>
        <ul className="space-y-2">
          {brief.controls.map((c) => {
            const state = verified[c.id];
            return (
              <li
                key={c.id}
                className="flex items-center justify-between gap-2 rounded-md border border-border bg-background p-3"
              >
                <span className="text-sm text-foreground">{c.label}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setVerified((p) => ({ ...p, [c.id]: "ok" }));
                      toast.success("Verified");
                    }}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-display font-bold uppercase tracking-wider ${
                      state === "ok"
                        ? "bg-[var(--success)] text-white"
                        : "border border-border bg-background text-foreground hover:border-gold/60"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" /> Verify
                  </button>
                  <button
                    onClick={() => {
                      setVerified((p) => ({ ...p, [c.id]: "flag" }));
                      toast("Flagged for HSE follow-up");
                    }}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-display font-bold uppercase tracking-wider ${
                      state === "flag"
                        ? "bg-[color:var(--danger)] text-white"
                        : "border border-border bg-background text-foreground hover:border-gold/60"
                    }`}
                  >
                    <Flag className="h-3.5 w-3.5" /> Flag
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
