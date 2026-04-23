import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { KpiCard } from "@/components/KpiCard";
import { KpiPanel } from "@/components/KpiPanel";
import { DeptChart } from "@/components/DeptChart";
import { DisruptionFlow } from "@/components/DisruptionFlow";
import { GuidedTour } from "@/components/GuidedTour";
import { CrossDeptMatrix } from "@/components/CrossDeptMatrix";
import { ActionQueue } from "@/components/ActionQueue";
import { DecisionLog } from "@/components/DecisionLog";
import { FieldSignalsStrip } from "@/components/FieldSignalsStrip";
import { FrontlineShell } from "@/components/FrontlineShell";
import { useDisruption } from "@/context/DisruptionContext";
import { departments, getDepartment, type DepartmentId, type Kpi } from "@/data/departments";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kumba Iron Ore — Strategic Innovation Dashboard" },
      {
        name: "description",
        content:
          "Cross-functional console connecting Mining, Logistics, Safety/HSE, Sustainability and Governance for Kumba Iron Ore.",
      },
      { property: "og:title", content: "Kumba Iron Ore — Strategic Innovation Dashboard" },
      {
        property: "og:description",
        content:
          "Disruption-to-response orchestration across Sishen, Kolomela, Transnet rail and Saldanha port.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [activeId, setActiveId] = useState<DepartmentId>("governance");
  const [openKpi, setOpenKpi] = useState<Kpi | null>(null);
  const dept = getDepartment(activeId);
  const { mode } = useDisruption();

  if (mode === "frontline") return <FrontlineShell />;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div data-tour="dept-switcher" className="contents">
        <Sidebar active={activeId} onChange={setActiveId} />
      </div>

      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto w-full max-w-[1400px] space-y-6 px-4 py-6 md:px-8 md:py-8">
          {/* Page header */}
          <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                Strategic Innovation Console · {dept.role}
              </div>
              <h1 className="mt-1 font-display text-3xl font-bold text-navy md:text-4xl">
                {dept.name}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{dept.tagline}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <span className="rounded-full bg-card px-3 py-1 ring-1 ring-border">
                Owner · <strong className="text-foreground">{dept.owner}</strong>
              </span>
              <span className="rounded-full bg-card px-3 py-1 ring-1 ring-border">
                Period · LTM
              </span>
              <span className="rounded-full bg-[var(--gradient-gold)] px-3 py-1 text-navy">
                Live
              </span>
            </div>
          </header>

          {/* Hero disruption flow */}
          <DisruptionFlow />

          {/* KPI grid (dynamic per dept) */}
          <section data-tour="kpi-grid" className="bg-transparent">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-display text-lg font-bold text-navy">
                {dept.name} · Key indicators
              </h2>
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Click a card for breakdown
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {dept.kpis.map((k) => (
                <KpiCard key={k.id} kpi={k} onOpen={setOpenKpi} />
              ))}
            </div>
          </section>

          {/* Action queue (response-side) */}
          <div data-tour="action-queue">
            <ActionQueue dept={activeId} />
          </div>

          {/* Governance-only: field signals + decision log */}
          {activeId === "governance" && (
            <div data-tour="field-signals">
              <FieldSignalsStrip />
            </div>
          )}
          {activeId === "governance" && (
            <div data-tour="decision-log">
              <DecisionLog />
            </div>
          )}

          {/* Chart + cross-dept */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div data-tour="dept-chart" className="lg:col-span-2">
              <DeptChart chart={dept.chart} />
            </div>
            <div data-tour="cross-matrix">
              <CrossDeptMatrix active={activeId} />
            </div>
          </section>

          {/* Department roster */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-display text-base font-bold text-navy">
              Departments in the value chain
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              {departments.map((d) => {
                const isActive = d.id === activeId;
                return (
                  <button
                    key={d.id}
                    onClick={() => setActiveId(d.id)}
                    className={`rounded-lg border p-3 text-left transition-all ${
                      isActive
                        ? "border-gold bg-navy text-white shadow-[var(--shadow-gold)]"
                        : "border-border bg-background hover:border-gold/60"
                    }`}
                  >
                    <div
                      className={`font-display text-[11px] font-bold uppercase tracking-wider ${
                        isActive ? "text-gold" : "text-muted-foreground"
                      }`}
                    >
                      {d.role}
                    </div>
                    <div
                      className={`mt-1 font-display text-sm font-bold ${
                        isActive ? "text-white" : "text-navy"
                      }`}
                    >
                      {d.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <KpiPanel kpi={openKpi} onClose={() => setOpenKpi(null)} />
      <GuidedTour />
    </div>
  );
}
