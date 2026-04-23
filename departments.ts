export type DepartmentId =
  | "governance"
  | "operations"
  | "mining"
  | "safety"
  | "sustainability";

export interface Kpi {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  status: "ok" | "warn" | "risk";
  unit?: string;
  definition: string;
  formula: string;
  source: string;
  updated: string;
  breakdown: { label: string; value: number; share: string }[];
}

export interface ChartSeries {
  title: string;
  type: "line" | "bar" | "area";
  data: { name: string; a: number; b?: number }[];
  legend: { a: string; b?: string };
}

export interface Department {
  id: DepartmentId;
  name: string;
  role: string;
  tagline: string;
  owner: string;
  kpis: Kpi[];
  chart: ChartSeries;
}

const baseUpdated = "Today · 08:42 SAST";

export const departments: Department[] = [
  {
    id: "governance",
    name: "Governance, ESG & Finance",
    role: "Strategic oversight",
    tagline: "Capital allocation, disclosure integrity, ESG posture.",
    owner: "Office of the CFO & Company Secretary",
    kpis: [
      {
        id: "gov-debt",
        label: "Net Debt / EBITDA",
        value: "0.42x",
        delta: "+0.08x QoQ",
        trend: "up",
        status: "warn",
        definition: "Leverage ratio measuring net interest-bearing debt against trailing EBITDA.",
        formula: "(Total Debt − Cash) ÷ EBITDA(LTM)",
        source: "Treasury · IFRS consolidated",
        updated: baseUpdated,
        breakdown: [
          { label: "Senior facilities", value: 4200, share: "58%" },
          { label: "Revolving credit", value: 1800, share: "25%" },
          { label: "Lease liabilities", value: 1240, share: "17%" },
        ],
      },
      {
        id: "gov-fcf",
        label: "Free Cash Flow",
        value: "R 6.1bn",
        delta: "−R 0.9bn vs plan",
        trend: "down",
        status: "risk",
        definition: "Operating cash flow less sustaining capex, before financing.",
        formula: "CFO − Sustaining Capex",
        source: "Group Finance · Month-end close",
        updated: baseUpdated,
        breakdown: [
          { label: "CFO", value: 9400, share: "100%" },
          { label: "Sustaining capex", value: -3300, share: "−35%" },
          { label: "Working capital", value: -200, share: "−2%" },
        ],
      },
      {
        id: "gov-esg",
        label: "ESG Composite Score",
        value: "78 / 100",
        delta: "+3 YoY",
        trend: "up",
        status: "ok",
        definition: "Weighted blend of Sustainalytics, MSCI and internal disclosure index.",
        formula: "0.4·E + 0.3·S + 0.3·G (normalised)",
        source: "Sustainability & IR",
        updated: baseUpdated,
        breakdown: [
          { label: "Environment", value: 81, share: "40%" },
          { label: "Social", value: 74, share: "30%" },
          { label: "Governance", value: 79, share: "30%" },
        ],
      },
      {
        id: "gov-comp",
        label: "Compliance Findings (open)",
        value: "12",
        delta: "−4 MoM",
        trend: "down",
        status: "ok",
        definition: "Unresolved internal & external audit findings across business units.",
        formula: "Σ open findings (severity ≥ medium)",
        source: "Internal Audit register",
        updated: baseUpdated,
        breakdown: [
          { label: "High", value: 2, share: "17%" },
          { label: "Medium", value: 7, share: "58%" },
          { label: "Low", value: 3, share: "25%" },
        ],
      },
    ],
    chart: {
      title: "Cash flow vs Net Debt (R bn, last 6 quarters)",
      type: "area",
      legend: { a: "Free Cash Flow", b: "Net Debt" },
      data: [
        { name: "Q1", a: 8.4, b: 6.2 },
        { name: "Q2", a: 7.9, b: 6.5 },
        { name: "Q3", a: 7.2, b: 6.9 },
        { name: "Q4", a: 6.8, b: 7.1 },
        { name: "Q1+", a: 6.5, b: 7.0 },
        { name: "Q2+", a: 6.1, b: 7.2 },
      ],
    },
  },
  {
    id: "operations",
    name: "Logistics & Supply Chain",
    role: "Transnet rail · Saldanha port",
    tagline: "End-to-end ore evacuation from pit to vessel.",
    owner: "VP Logistics",
    kpis: [
      {
        id: "ops-rail",
        label: "Rail Throughput",
        value: "58.2 Mtpa",
        delta: "−6% vs plan",
        trend: "down",
        status: "risk",
        definition: "Annualised tonnage railed via the Sishen-Saldanha corridor.",
        formula: "Trains × payload × cycle frequency (LTM)",
        source: "Transnet TFR interface",
        updated: baseUpdated,
        breakdown: [
          { label: "Sishen lane", value: 41, share: "70%" },
          { label: "Kolomela lane", value: 17, share: "30%" },
        ],
      },
      {
        id: "ops-port",
        label: "Port Stockpile",
        value: "1.84 Mt",
        delta: "+0.22 Mt WoW",
        trend: "up",
        status: "warn",
        definition: "Run-of-mine inventory awaiting vessel loading at Saldanha.",
        formula: "Opening stock + railed − shipped",
        source: "Saldanha terminal SCADA",
        updated: baseUpdated,
        breakdown: [
          { label: "Lump", value: 1.1, share: "60%" },
          { label: "Fines", value: 0.74, share: "40%" },
        ],
      },
      {
        id: "ops-otd",
        label: "Vessel On-Time Departure",
        value: "87%",
        delta: "−4 pts",
        trend: "down",
        status: "warn",
        definition: "Share of vessels departing within laytime window.",
        formula: "On-time vessels ÷ total vessels",
        source: "Port operations",
        updated: baseUpdated,
        breakdown: [
          { label: "On-time", value: 87, share: "87%" },
          { label: "Demurrage", value: 13, share: "13%" },
        ],
      },
      {
        id: "ops-cycle",
        label: "Wagon Cycle Time",
        value: "62 hrs",
        delta: "+5 hrs",
        trend: "up",
        status: "risk",
        definition: "Average return-trip duration for ore wagons.",
        formula: "Σ trip time ÷ trips",
        source: "TFR telemetry",
        updated: baseUpdated,
        breakdown: [
          { label: "Loading", value: 8, share: "13%" },
          { label: "Transit", value: 42, share: "68%" },
          { label: "Unloading", value: 12, share: "19%" },
        ],
      },
    ],
    chart: {
      title: "Rail vs Shipped tonnage (Mt, last 6 weeks)",
      type: "bar",
      legend: { a: "Railed", b: "Shipped" },
      data: [
        { name: "W1", a: 1.18, b: 1.12 },
        { name: "W2", a: 1.22, b: 1.15 },
        { name: "W3", a: 1.05, b: 1.10 },
        { name: "W4", a: 0.92, b: 1.04 },
        { name: "W5", a: 0.88, b: 0.96 },
        { name: "W6", a: 0.81, b: 0.90 },
      ],
    },
  },
  {
    id: "mining",
    name: "Mine Production",
    role: "Sishen & Kolomela",
    tagline: "Pit-to-plant performance across both operations.",
    owner: "VP Mining",
    kpis: [
      {
        id: "min-prod",
        label: "Total ROM Production",
        value: "63.4 Mt",
        delta: "+1.2 Mt YoY",
        trend: "up",
        status: "ok",
        definition: "Run-of-mine ore mined across Sishen + Kolomela.",
        formula: "Sishen ROM + Kolomela ROM",
        source: "Mine planning · daily",
        updated: baseUpdated,
        breakdown: [
          { label: "Sishen", value: 44, share: "69%" },
          { label: "Kolomela", value: 19.4, share: "31%" },
        ],
      },
      {
        id: "min-strip",
        label: "Stripping Ratio",
        value: "4.1 : 1",
        delta: "+0.3 vs plan",
        trend: "up",
        status: "warn",
        definition: "Waste tonnes moved per tonne of ore extracted.",
        formula: "Waste tonnes ÷ Ore tonnes",
        source: "Mine planning",
        updated: baseUpdated,
        breakdown: [
          { label: "Sishen", value: 4.6, share: "—" },
          { label: "Kolomela", value: 3.2, share: "—" },
        ],
      },
      {
        id: "min-grade",
        label: "Average Fe Grade",
        value: "64.1%",
        delta: "+0.2 pts",
        trend: "up",
        status: "ok",
        definition: "Iron content of beneficiated product.",
        formula: "Σ (tonnes × Fe%) ÷ Σ tonnes",
        source: "Plant assay lab",
        updated: baseUpdated,
        breakdown: [
          { label: "Lump", value: 64.6, share: "—" },
          { label: "Fines", value: 63.7, share: "—" },
        ],
      },
      {
        id: "min-equip",
        label: "Equipment Availability",
        value: "82%",
        delta: "−3 pts",
        trend: "down",
        status: "warn",
        definition: "Truck & shovel uptime across both pits.",
        formula: "Operating hrs ÷ scheduled hrs",
        source: "Asset management system",
        updated: baseUpdated,
        breakdown: [
          { label: "Trucks", value: 84, share: "—" },
          { label: "Shovels", value: 79, share: "—" },
          { label: "Drills", value: 81, share: "—" },
        ],
      },
    ],
    chart: {
      title: "ROM production by mine (Mt, monthly)",
      type: "line",
      legend: { a: "Sishen", b: "Kolomela" },
      data: [
        { name: "Jan", a: 3.6, b: 1.5 },
        { name: "Feb", a: 3.5, b: 1.6 },
        { name: "Mar", a: 3.8, b: 1.7 },
        { name: "Apr", a: 3.7, b: 1.6 },
        { name: "May", a: 3.9, b: 1.8 },
        { name: "Jun", a: 3.6, b: 1.7 },
      ],
    },
  },
  {
    id: "safety",
    name: "Safety & HSE",
    role: "Zero harm",
    tagline: "Personal & process safety across the value chain.",
    owner: "VP HSE",
    kpis: [
      {
        id: "saf-trifr",
        label: "TRIFR",
        value: "1.42",
        delta: "−0.18 YoY",
        trend: "down",
        status: "ok",
        definition: "Total Recordable Injury Frequency Rate per million hours.",
        formula: "(Recordables × 1,000,000) ÷ hours worked",
        source: "HSE incident system",
        updated: baseUpdated,
        breakdown: [
          { label: "Sishen", value: 1.6, share: "—" },
          { label: "Kolomela", value: 1.1, share: "—" },
          { label: "Logistics", value: 1.5, share: "—" },
        ],
      },
      {
        id: "saf-ltifr",
        label: "LTIFR",
        value: "0.21",
        delta: "−0.04 YoY",
        trend: "down",
        status: "ok",
        definition: "Lost Time Injury Frequency Rate per million hours.",
        formula: "(LTIs × 1,000,000) ÷ hours worked",
        source: "HSE incident system",
        updated: baseUpdated,
        breakdown: [
          { label: "Operations", value: 0.18, share: "—" },
          { label: "Contractors", value: 0.27, share: "—" },
        ],
      },
      {
        id: "saf-hipo",
        label: "HiPo events (YTD)",
        value: "7",
        delta: "+2 vs prior",
        trend: "up",
        status: "warn",
        definition: "High-potential incidents — actual or near-miss with fatality potential.",
        formula: "Σ HiPo classifications",
        source: "ICAM investigations",
        updated: baseUpdated,
        breakdown: [
          { label: "Mobile equipment", value: 3, share: "43%" },
          { label: "Working at heights", value: 2, share: "29%" },
          { label: "Energy isolation", value: 2, share: "29%" },
        ],
      },
      {
        id: "saf-train",
        label: "Critical Control Verifications",
        value: "96%",
        delta: "+2 pts",
        trend: "up",
        status: "ok",
        definition: "Field verifications of critical safety controls vs plan.",
        formula: "Verifications done ÷ planned",
        source: "HSE field audits",
        updated: baseUpdated,
        breakdown: [
          { label: "Sishen", value: 97, share: "—" },
          { label: "Kolomela", value: 95, share: "—" },
        ],
      },
    ],
    chart: {
      title: "TRIFR trend (per million hours)",
      type: "line",
      legend: { a: "Group TRIFR", b: "Target" },
      data: [
        { name: "Jan", a: 1.7, b: 1.5 },
        { name: "Feb", a: 1.65, b: 1.5 },
        { name: "Mar", a: 1.55, b: 1.5 },
        { name: "Apr", a: 1.5, b: 1.5 },
        { name: "May", a: 1.46, b: 1.5 },
        { name: "Jun", a: 1.42, b: 1.5 },
      ],
    },
  },
  {
    id: "sustainability",
    name: "Sustainability",
    role: "Climate · water · community",
    tagline: "Decarbonisation, water stewardship, social licence.",
    owner: "VP Sustainability",
    kpis: [
      {
        id: "sus-co2",
        label: "Scope 1+2 emissions",
        value: "1.18 Mt CO₂e",
        delta: "−4% YoY",
        trend: "down",
        status: "ok",
        definition: "Direct + purchased energy GHG emissions.",
        formula: "Σ activity × emission factor",
        source: "GHG inventory · GRI 305",
        updated: baseUpdated,
        breakdown: [
          { label: "Diesel (Scope 1)", value: 0.78, share: "66%" },
          { label: "Electricity (Scope 2)", value: 0.40, share: "34%" },
        ],
      },
      {
        id: "sus-water",
        label: "Water reuse rate",
        value: "71%",
        delta: "+3 pts",
        trend: "up",
        status: "ok",
        definition: "Share of process water that is reclaimed/recycled.",
        formula: "Reused ÷ total withdrawn",
        source: "Site water balance",
        updated: baseUpdated,
        breakdown: [
          { label: "Sishen", value: 73, share: "—" },
          { label: "Kolomela", value: 68, share: "—" },
        ],
      },
      {
        id: "sus-energy",
        label: "Renewable energy share",
        value: "18%",
        delta: "+6 pts",
        trend: "up",
        status: "ok",
        definition: "Share of consumed electricity from renewable PPAs.",
        formula: "Renewable MWh ÷ total MWh",
        source: "Energy mgmt system",
        updated: baseUpdated,
        breakdown: [
          { label: "Solar PPA", value: 14, share: "78%" },
          { label: "Wind PPA", value: 4, share: "22%" },
        ],
      },
      {
        id: "sus-soc",
        label: "Community investment",
        value: "R 412m",
        delta: "+8% YoY",
        trend: "up",
        status: "ok",
        definition: "SLP & community-development spend in host communities.",
        formula: "Σ approved disbursements",
        source: "Social performance ledger",
        updated: baseUpdated,
        breakdown: [
          { label: "Education", value: 165, share: "40%" },
          { label: "Health", value: 124, share: "30%" },
          { label: "Enterprise dev", value: 123, share: "30%" },
        ],
      },
    ],
    chart: {
      title: "CO₂ intensity vs renewable share",
      type: "area",
      legend: { a: "tCO₂e / kt ore", b: "Renewable %" },
      data: [
        { name: "2020", a: 22, b: 4 },
        { name: "2021", a: 21, b: 6 },
        { name: "2022", a: 20, b: 9 },
        { name: "2023", a: 19, b: 12 },
        { name: "2024", a: 18, b: 15 },
        { name: "2025", a: 17, b: 18 },
      ],
    },
  },
];

export const getDepartment = (id: DepartmentId) =>
  departments.find((d) => d.id === id) ?? departments[0];
