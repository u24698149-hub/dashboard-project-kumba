import { useEffect, useState } from "react";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

const steps = [
  {
    selector: '[data-tour="dept-switcher"]',
    title: "Switch departments",
    body: "Use the sidebar to jump between Operations, Mining, Safety, Sustainability and Governance. The whole workspace adapts.",
  },
  {
    selector: '[data-tour="hero-flow"]',
    title: "Hero flow: Disruption → Response",
    body: "A live P1 disruption shows severity, time-since-detected, and a Treasury SLA countdown. The flow ends in a Governance-led cross-debt response.",
  },
  {
    selector: '[data-tour="alert-button"]',
    title: "Open the Response Playbook",
    body: "Click the red Disruption Alert card to open three pre-built scenarios — Absorb, Reroute, Throttle — each with cash, EBITDA, Scope 1, safety and time-to-recover impact. Pick one and commit.",
  },
  {
    selector: '[data-tour="kpi-grid"]',
    title: "KPIs that respond",
    body: "Once a scenario is committed, every KPI card shows a 'projected under active scenario' chip so you can see the response footprint at a glance.",
  },
  {
    selector: '[data-tour="action-queue"]',
    title: "Pending actions",
    body: "Each department gets routed atomic tasks with named owners and SLA windows. Acknowledge, reassign, or escalate to Governance.",
  },
  {
    selector: '[data-tour="decision-log"]',
    title: "Decisions in flight",
    body: "Governance sees a chronological audit trail of committed responses — advance status, or one-click generate a draft board memo.",
  },
  {
    selector: '[data-tour="cross-matrix"]',
    title: "What-if & cross-department impact",
    body: "Drag the rail-recovery preset (3/7/14 days) to recompute projected demurrage, FCF hit, and Scope 1 delta on each cross-department interaction.",
  },
  {
    selector: '[data-tour="field-signals"]',
    title: "Field signals from the ground",
    body: "Reports filed by operators on shift land here in real time. Acknowledge them or convert any signal into a routed pending action.",
  },
  {
    selector: '[data-tour="mode-toggle"]',
    title: "Switch to Frontline mode",
    body: "Flip to Frontline to see what an operator sees on shift: a plain-English instruction for the active scenario, today's critical controls, a one-tap field report button, and a shift-handover note.",
  },
];

export function GuidedTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const seen = localStorage.getItem("kumba-tour-seen");
    if (!seen) setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = document.querySelector(steps[step].selector) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      requestAnimationFrame(() => setRect(el.getBoundingClientRect()));
    } else {
      setRect(null);
    }
    const onResize = () => {
      const e = document.querySelector(steps[step].selector) as HTMLElement | null;
      if (e) setRect(e.getBoundingClientRect());
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open, step]);

  const close = () => {
    setOpen(false);
    localStorage.setItem("kumba-tour-seen", "1");
  };

  if (!open) {
    return (
      <button
        onClick={() => {
          setStep(0);
          setOpen(true);
        }}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-navy px-4 py-2.5 text-sm font-display font-bold uppercase tracking-wider text-white shadow-[var(--shadow-elegant)] transition-all hover:bg-navy-deep"
      >
        <Sparkles className="h-4 w-4 text-gold" /> Guided tour
      </button>
    );
  }

  const s = steps[step];
  const top = rect ? Math.max(rect.bottom + 12, 80) : 120;
  const left = rect ? Math.min(Math.max(rect.left, 16), window.innerWidth - 360) : 16;

  return (
    <div className="fixed inset-0 z-50">
      {/* Dim overlay with cut-out */}
      <div className="absolute inset-0 bg-navy/65 transition-opacity" onClick={close} />
      {rect && (
        <div
          className="pointer-events-none absolute rounded-lg ring-4 ring-gold/80 transition-all"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            boxShadow: "0 0 0 9999px rgba(10,34,64,0.55)",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute w-[340px] max-w-[92vw] rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-elegant)]"
        style={{ top, left }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
            Tour · {step + 1} / {steps.length}
          </div>
          <button onClick={close} className="text-muted-foreground hover:text-foreground" aria-label="End tour">
            <X className="h-4 w-4" />
          </button>
        </div>
        <h4 className="mt-1 font-display text-lg font-bold text-navy">{s.title}</h4>
        <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setStep((n) => Math.max(0, n - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep((n) => n + 1)}
              className="flex items-center gap-1 rounded-md bg-navy px-3 py-2 text-sm font-display font-bold uppercase tracking-wider text-white hover:bg-navy-deep"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={close}
              className="rounded-md bg-[var(--gradient-gold)] px-3 py-2 text-sm font-display font-bold uppercase tracking-wider text-navy"
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
