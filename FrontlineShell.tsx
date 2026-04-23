import { useDisruption } from "@/context/DisruptionContext";
import { frontlineRoles, getFrontlineRole } from "@/data/frontline";
import { MyShiftCard } from "./MyShiftCard";
import { ScenarioInstruction } from "./ScenarioInstruction";
import { HandoverNote } from "./HandoverNote";
import { FieldReportSheet } from "./FieldReportSheet";
import { DisruptionBadge } from "./DisruptionBadge";
import { ArrowLeft } from "lucide-react";

export function FrontlineShell() {
  const { frontlineRole, setFrontlineRole, setMode } = useDisruption();
  const role = getFrontlineRole(frontlineRole);

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-navy text-white">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <button
            onClick={() => setMode("executive")}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-display font-bold uppercase tracking-wider text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Exec view
          </button>
          <div className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
            Frontline · {role.shift}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl space-y-4 px-4 py-5">
        {/* Role picker */}
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="mb-2 font-display text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            I'm working as
          </div>
          <div className="flex flex-wrap gap-1.5">
            {frontlineRoles.map((r) => (
              <button
                key={r.id}
                onClick={() => setFrontlineRole(r.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider transition-all ${
                  r.id === frontlineRole
                    ? "bg-navy text-white"
                    : "border border-border bg-background text-foreground hover:border-gold/60"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-navy p-3">
          <DisruptionBadge />
        </div>
        <ScenarioInstruction roleId={frontlineRole} />
        <MyShiftCard roleId={frontlineRole} />
        <HandoverNote roleId={frontlineRole} />

        <p className="pb-24 text-center text-[11px] uppercase tracking-wider text-muted-foreground">
          Tap "Report from field" anytime · HiPo escalates instantly
        </p>
      </main>

      <FieldReportSheet />
    </div>
  );
}
