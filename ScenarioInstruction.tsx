import { useDisruption } from "@/context/DisruptionContext";
import { getScenario } from "@/data/disruptions";
import { scenarioInstructions, type FrontlineRoleId } from "@/data/frontline";
import { Megaphone } from "lucide-react";

export function ScenarioInstruction({ roleId }: { roleId: FrontlineRoleId }) {
  const { scenarioId, disruption } = useDisruption();
  const sc = getScenario(scenarioId);
  if (!sc || !scenarioId) return null;

  const text = scenarioInstructions[scenarioId][roleId] ?? sc.description;

  return (
    <section className="rounded-xl border-2 border-gold/70 bg-[var(--gradient-gold)] p-5 text-navy shadow-[var(--shadow-gold)]">
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5" />
        <div className="font-display text-[10px] font-bold uppercase tracking-[0.22em]">
          Until further notice · Scenario {sc.name}
        </div>
      </div>
      <p className="mt-2 font-display text-lg font-bold leading-snug">{text}</p>
      <p className="mt-2 text-xs text-navy/80">
        Source: {disruption.id} · {disruption.title}
      </p>
    </section>
  );
}
