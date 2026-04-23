import type { DepartmentId } from "./departments";
import type { ScenarioId } from "./disruptions";

export type FrontlineRoleId =
  | "sishen-pit"
  | "rail-controller"
  | "saldanha-port"
  | "hse-officer"
  | "plant-operator";

export interface FrontlineRole {
  id: FrontlineRoleId;
  name: string;
  location: string;
  dept: DepartmentId;
  shift: string;
}

export const frontlineRoles: FrontlineRole[] = [
  { id: "sishen-pit", name: "Sishen pit operator", location: "Sishen · Pit 4", dept: "mining", shift: "06:00 – 14:00" },
  { id: "rail-controller", name: "Rail controller", location: "Saldanha corridor · CTC", dept: "operations", shift: "06:00 – 18:00" },
  { id: "saldanha-port", name: "Saldanha port handler", location: "Saldanha · Berth 2", dept: "operations", shift: "06:00 – 14:00" },
  { id: "hse-officer", name: "HSE field officer", location: "Sishen · Roving", dept: "safety", shift: "07:00 – 16:00" },
  { id: "plant-operator", name: "Plant operator", location: "Sishen · Beneficiation", dept: "mining", shift: "06:00 – 14:00" },
];

export const getFrontlineRole = (id: FrontlineRoleId) =>
  frontlineRoles.find((r) => r.id === id) ?? frontlineRoles[0];

export interface ShiftBrief {
  headline: string;
  metric: { label: string; value: string }[];
  controls: { id: string; label: string }[];
}

export const baselineBriefs: Record<FrontlineRoleId, ShiftBrief> = {
  "sishen-pit": {
    headline: "Standard haul plan in effect",
    metric: [
      { label: "Today's target", value: "118 kt ROM" },
      { label: "Trucks running", value: "22 / 24" },
      { label: "Next handover", value: "14:00" },
    ],
    controls: [
      { id: "c1", label: "Verify haul road berm condition (S2)" },
      { id: "c2", label: "Confirm shovel 7 isolation tag" },
    ],
  },
  "rail-controller": {
    headline: "Cycle time elevated · monitor slot 14:30",
    metric: [
      { label: "Cycle time", value: "62 hrs" },
      { label: "Next 3 slots", value: "12:00 · 14:30 · 17:00" },
      { label: "Wagons staged", value: "84" },
    ],
    controls: [
      { id: "c1", label: "Confirm Postmasburg single-line protocol" },
      { id: "c2", label: "Brief incoming controller on TFR escalation" },
    ],
  },
  "saldanha-port": {
    headline: "Stockpile build at 1.84 Mt",
    metric: [
      { label: "Stockpile", value: "1.84 Mt" },
      { label: "Vessel queue", value: "5 vessels" },
      { label: "Loader status", value: "L1 ✓ · L2 hold" },
    ],
    controls: [
      { id: "c1", label: "Re-confirm Cape Hawk berthing window" },
      { id: "c2", label: "Verify dust suppression run on stockpile A" },
    ],
  },
  "hse-officer": {
    headline: "4 critical-control verifications due today",
    metric: [
      { label: "Verifications", value: "8 / 12 done" },
      { label: "Open HiPo", value: "1" },
      { label: "Site", value: "Sishen" },
    ],
    controls: [
      { id: "c1", label: "Mobile equipment separation — Pit 4" },
      { id: "c2", label: "Energy isolation — Shovel 7" },
      { id: "c3", label: "Working at heights — Plant access" },
      { id: "c4", label: "Road haulage contractor PPE check" },
    ],
  },
  "plant-operator": {
    headline: "Lump/fines split nominal",
    metric: [
      { label: "Throughput", value: "4.6 kt/hr" },
      { label: "Lump : Fines", value: "60 : 40" },
      { label: "Fe grade", value: "64.1%" },
    ],
    controls: [
      { id: "c1", label: "Confirm screen 3 vibration in tolerance" },
      { id: "c2", label: "Sample assay handoff at 12:00" },
    ],
  },
};

// Plain-English instruction per (scenario × role)
export const scenarioInstructions: Record<ScenarioId, Partial<Record<FrontlineRoleId, string>>> = {
  absorb: {
    "sishen-pit": "Hold haul plan as-is. Continue feeding stockpile — Treasury is funding the port build-up.",
    "rail-controller": "Run trains as scheduled. No throttling; expect higher port stockpile.",
    "saldanha-port": "Expect stockpile build to ~2.1 Mt this week. Hold loader 2 in standby; demurrage is covered.",
    "hse-officer": "No haul-plan change — verify standard critical controls only.",
    "plant-operator": "No feed change. Maintain current lump/fines split.",
  },
  reroute: {
    "sishen-pit": "Hold haul plan. Some Kolomela tonnes diverting to road — watch for additional contractor traffic on shared roads.",
    "rail-controller": "Reduced rail tonnage from Kolomela for ~4 days. Reprioritise Sishen slots.",
    "saldanha-port": "Road trucks inbound — open contractor gate 3, brief weighbridge for higher truck volume.",
    "hse-officer": "Elevated risk: brief contractor road-haulage drivers, verify fatigue-management compliance every 4h.",
    "plant-operator": "No feed change at Sishen plant. Kolomela may push extra fines — be ready for blend adjustment.",
  },
  throttle: {
    "sishen-pit": "Reduce ROM by 8%. Prioritise lump feed. Next review: 14:00. Reason: rail recovery — Treasury covering demurrage. You don't need to do anything about cash.",
    "rail-controller": "Expect ~6% lower wagon demand from Sishen for 7–10 days. Free slots can support recovery cadence.",
    "saldanha-port": "Stockpile build will slow. Maintain current vessel cadence; no new bookings needed.",
    "hse-officer": "Altered haul plan — re-verify mobile equipment separation and shovel isolations under reduced cycle.",
    "plant-operator": "Rebalance feed toward lump premium product. Tighten screen 3 setpoint per lump spec.",
  },
};
