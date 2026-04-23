import { AlertTriangle, ArrowRight, Train, Pickaxe, ShieldCheck, Scale, Leaf, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { ResponsePlaybookDrawer } from "@/components/ResponsePlaybookDrawer";
import { DisruptionBadge } from "@/components/DisruptionBadge";
import { useDisruption } from "@/context/DisruptionContext";
import { getScenario } from "@/data/disruptions";

const steps = [
  {
    icon: AlertTriangle,
    title: "Disruption Alert",
    sub: "Transnet rail cycle time +18% — corridor capacity drop",
    tone: "alert",
  },
  {
    icon: Pickaxe,
    title: "Mine Production",
    sub: "Throttle ROM at Sishen, redirect Kolomela tonnes to lump",
    tone: "step",
  },
  {
    icon: Train,
    title: "Logistics & SC",
    sub: "Rebook Saldanha vessels, escalate slot-recovery with TFR",
    tone: "step",
  },
  {
    icon: ShieldCheck,
    title: "Safety & HSE",
    sub: "Verify critical controls under altered haul plan",
    tone: "step",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    sub: "Quantify Scope 1 impact of stockpile build-up",
    tone: "step",
  },
  {
    icon: Scale,
    title: "Cross-Debt Response",
    sub: "Treasury draws revolver tranche · IR pre-brief · ESG note filed",
    tone: "resolve",
  },
];

export function DisruptionFlow() {
  const [open, setOpen] = useState(false);
  const { scenarioId } = useDisruption();
  const committed = getScenario(scenarioId);

  return (
    <section
      data-tour="hero-flow"
      className="relative overflow-hidden rounded-2xl bg-[var(--gradient-hero)] p-6 text-primary-foreground shadow-[var(--shadow-elegant)] md:p-8 bg-slate-600"
    >
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-gold" />
            Live Hero Flow
          </div>
          <DisruptionBadge />
        </div>
        <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
          Disruption Alert → Cross-Debt Response
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-white/75">
          A Transnet rail incident triggers a coordinated response across Mining, Logistics, Safety,
          Sustainability — converging on the Governance &amp; Treasury desk for a financing-side
          resolution.
        </p>

        {committed && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-display font-bold uppercase tracking-wider text-navy shadow-[var(--shadow-gold)]">
            <CheckCircle2 className="h-3.5 w-3.5" /> Response committed · {committed.name}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isAlert = s.tone === "alert";
            const isResolve = s.tone === "resolve";
            const cardClass = `flex h-full flex-col gap-2 rounded-xl border p-4 backdrop-blur-sm transition-all ${
              isAlert
                ? "border-destructive/60 bg-destructive/15 hover:bg-destructive/25 cursor-pointer text-left"
                : isResolve
                  ? "border-gold/60 bg-gold/15"
                  : "border-white/15 bg-white/5"
            }`;

            const inner = (
              <>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-md ${
                    isAlert
                      ? "bg-destructive text-white"
                      : isResolve
                        ? "bg-gold text-navy"
                        : "bg-white/10 text-gold"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="font-display text-[11px] font-bold uppercase tracking-wider text-white/80">
                  Step {i + 1}
                </div>
                <div className="font-display text-sm font-bold text-white">{s.title}</div>
                <div className="text-[12px] leading-snug text-white/70">{s.sub}</div>
                {isAlert && (
                  <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-display font-bold uppercase tracking-wider text-gold">
                    Open playbook <ArrowRight className="h-3 w-3" />
                  </div>
                )}
              </>
            );

            return (
              <div key={s.title} className="relative" data-tour={isAlert ? "alert-button" : undefined}>
                {isAlert ? (
                  <button type="button" onClick={() => setOpen(true)} className={cardClass}>
                    {inner}
                  </button>
                ) : (
                  <div className={cardClass}>{inner}</div>
                )}
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-gold lg:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ResponsePlaybookDrawer open={open} onOpenChange={setOpen} />
    </section>
  );
}
