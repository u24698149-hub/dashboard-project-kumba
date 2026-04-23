import type { DepartmentId } from "./departments";

export type Severity = "P1" | "P2" | "P3";
export type ScenarioId = "absorb" | "reroute" | "throttle";

export interface ScenarioImpact {
  cash: string;       // e.g. "−R 320m"
  ebitda: string;     // e.g. "−R 110m"
  scope1: string;     // e.g. "+0.4%"
  safety: "Low" | "Medium" | "Elevated";
  ttr: string;        // time-to-recover, e.g. "5 days"
}

export interface Scenario {
  id: ScenarioId;
  name: string;
  tagline: string;
  description: string;
  impact: ScenarioImpact;
  pros: string[];
  cons: string[];
}

export interface PendingAction {
  id: string;
  dept: DepartmentId;
  title: string;
  owner: string;
  due: string; // human readable
  scenario?: ScenarioId; // appears only when scenario active (or 'all')
}

export interface ActiveDisruption {
  id: string;
  title: string;
  detail: string;
  severity: Severity;
  detectedAt: number;       // epoch ms
  slaMinutes: number;       // SLA window in minutes
}

export const seededDisruption: ActiveDisruption = {
  id: "DSR-2025-RAIL-018",
  title: "Transnet rail cycle time +18%",
  detail:
    "Sishen-Saldanha corridor capacity dropped after a derailment near Postmasburg. Vessel queue building at Saldanha; demurrage exposure rising.",
  severity: "P1",
  // detected ~1h 46m ago so SLA countdown is meaningful and stable across renders
  detectedAt: Date.now() - 1000 * 60 * 106,
  slaMinutes: 240,
};

export const scenarios: Scenario[] = [
  {
    id: "absorb",
    name: "Absorb",
    tagline: "Hold stockpile · draw revolver · eat demurrage",
    description:
      "Maintain mine throughput, build port stockpile, and draw R 800m on the revolving facility to cover demurrage and working-capital swing while rail recovers.",
    impact: { cash: "−R 320m", ebitda: "−R 110m", scope1: "+0.2%", safety: "Low", ttr: "7 days" },
    pros: ["Lowest operational disruption", "Preserves volume guidance", "Safest under altered haul plan"],
    cons: ["Demurrage hit lands in current quarter", "Increases gross debt temporarily"],
  },
  {
    id: "reroute",
    name: "Reroute",
    tagline: "Divert tonnes to road haulage to Saldanha",
    description:
      "Contract third-party road haulage for a portion of Kolomela tonnes, easing port stockpile build-up and protecting vessel slots.",
    impact: { cash: "−R 460m", ebitda: "−R 180m", scope1: "+1.4%", safety: "Elevated", ttr: "4 days" },
    pros: ["Fastest recovery of vessel cadence", "Defends customer commitments"],
    cons: ["Material Scope 1 spike", "Higher road-transport HSE exposure"],
  },
  {
    id: "throttle",
    name: "Throttle",
    tagline: "Slow Sishen ROM · rebalance to lump",
    description:
      "Throttle ROM at Sishen and rebalance plant feed toward lump premium product to protect realised price while volumes ease.",
    impact: { cash: "−R 210m", ebitda: "−R 60m", scope1: "−0.6%", safety: "Low", ttr: "10 days" },
    pros: ["Protects margin and ESG posture", "No incremental debt draw"],
    cons: ["Volume guidance at risk", "Slowest recovery profile"],
  },
];

export const getScenario = (id: ScenarioId | null) =>
  id ? scenarios.find((s) => s.id === id) ?? null : null;

// Pending actions routed to each department once the disruption is live.
export const pendingActionsByDept: Record<DepartmentId, PendingAction[]> = {
  governance: [
    { id: "act-gov-1", dept: "governance", title: "Authorise R 800m revolver tranche", owner: "Group Treasurer", due: "Today · 14:00" },
    { id: "act-gov-2", dept: "governance", title: "Pre-brief IR on guidance risk", owner: "Head of IR", due: "Today · 16:30" },
    { id: "act-gov-3", dept: "governance", title: "File ESG note on Scope 1 deviation", owner: "Sustainability counsel", due: "Tomorrow · 09:00" },
  ],
  operations: [
    { id: "act-ops-1", dept: "operations", title: "Rebook 3 Saldanha vessel windows", owner: "Port ops lead", due: "Today · 12:00" },
    { id: "act-ops-2", dept: "operations", title: "Escalate slot recovery with TFR", owner: "VP Logistics", due: "Today · 13:00" },
    { id: "act-ops-3", dept: "operations", title: "Quantify demurrage exposure (5/7/14d)", owner: "Logistics analyst", due: "Today · 15:00" },
  ],
  mining: [
    { id: "act-min-1", dept: "mining", title: "Throttle Sishen ROM by 8%", owner: "Sishen GM", due: "Today · 11:00" },
    { id: "act-min-2", dept: "mining", title: "Rebalance Kolomela to lump feed", owner: "Kolomela plant mgr", due: "Today · 14:00" },
    { id: "act-min-3", dept: "mining", title: "Issue haul-plan change notice", owner: "Mine planning", due: "Today · 12:30" },
  ],
  safety: [
    { id: "act-saf-1", dept: "safety", title: "Verify critical controls under altered haul plan", owner: "HSE field lead", due: "Today · 13:30" },
    { id: "act-saf-2", dept: "safety", title: "Brief contractors on road-haulage exposure", owner: "Contractor mgmt", due: "Today · 15:00" },
  ],
  sustainability: [
    { id: "act-sus-1", dept: "sustainability", title: "Model Scope 1 delta for each scenario", owner: "GHG analyst", due: "Today · 14:30" },
    { id: "act-sus-2", dept: "sustainability", title: "Draft community comms on stockpile build", owner: "Social performance", due: "Tomorrow · 10:00" },
  ],
};
