import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { seededDisruption, scenarios, type ActiveDisruption, type ScenarioId } from "@/data/disruptions";
import type { DepartmentId } from "@/data/departments";
import { frontlineRoles, type FrontlineRoleId } from "@/data/frontline";

export type ActionStatus = "pending" | "ack" | "reassigned" | "escalated";

export interface DecisionLogEntry {
  id: string;
  scenarioId: ScenarioId;
  decidedBy: string;
  decidedAt: number;
  status: "Committed" | "In progress" | "Resolved";
  cash: string;
  ebitda: string;
}

export type FieldSeverity = "Low" | "Medium" | "HiPo";
export type FieldKind = "Equipment down" | "Safety concern" | "Weather" | "Slot missed" | "Other";

export interface FieldReport {
  id: string;
  role: FrontlineRoleId;
  dept: DepartmentId;
  kind: FieldKind;
  where: string;
  severity: FieldSeverity;
  note?: string;
  at: number;
  ack: boolean;
  converted: boolean;
}

export type ConsoleMode = "executive" | "frontline";

interface DisruptionState {
  disruption: ActiveDisruption;
  scenarioId: ScenarioId | null;
  actionStatus: Record<string, ActionStatus>;
  decisions: DecisionLogEntry[];
  recoveryDays: 3 | 7 | 14;
  mode: ConsoleMode;
  frontlineRole: FrontlineRoleId;
  fieldReports: FieldReport[];
  handoverNotes: Record<FrontlineRoleId, string>;
  commitScenario: (id: ScenarioId, decidedBy?: string) => void;
  clearScenario: () => void;
  setActionStatus: (id: string, status: ActionStatus, dept: DepartmentId) => void;
  setRecoveryDays: (d: 3 | 7 | 14) => void;
  resolveDecision: (id: string) => void;
  setMode: (m: ConsoleMode) => void;
  setFrontlineRole: (r: FrontlineRoleId) => void;
  addFieldReport: (r: Omit<FieldReport, "id" | "at" | "ack" | "converted">) => void;
  ackFieldReport: (id: string) => void;
  convertFieldReport: (id: string) => void;
  setHandoverNote: (role: FrontlineRoleId, note: string) => void;
}

const STORAGE_KEY = "kumba-disruption-v2";

const Ctx = createContext<DisruptionState | null>(null);

interface Persisted {
  scenarioId: ScenarioId | null;
  actionStatus: Record<string, ActionStatus>;
  decisions: DecisionLogEntry[];
  recoveryDays: 3 | 7 | 14;
  mode: ConsoleMode;
  frontlineRole: FrontlineRoleId;
  fieldReports: FieldReport[];
  handoverNotes: Record<FrontlineRoleId, string>;
}

const emptyHandover = frontlineRoles.reduce(
  (acc, r) => ({ ...acc, [r.id]: "" }),
  {} as Record<FrontlineRoleId, string>
);

const defaults: Persisted = {
  scenarioId: null,
  actionStatus: {},
  decisions: [],
  recoveryDays: 7,
  mode: "executive",
  frontlineRole: "sishen-pit",
  fieldReports: [],
  handoverNotes: emptyHandover,
};

export function DisruptionProvider({ children }: { children: ReactNode }) {
  const [scenarioId, setScenarioId] = useState<ScenarioId | null>(defaults.scenarioId);
  const [actionStatus, setActionStatusState] = useState<Record<string, ActionStatus>>(defaults.actionStatus);
  const [decisions, setDecisions] = useState<DecisionLogEntry[]>(defaults.decisions);
  const [recoveryDays, setRecoveryDays] = useState<3 | 7 | 14>(defaults.recoveryDays);
  const [mode, setMode] = useState<ConsoleMode>(defaults.mode);
  const [frontlineRole, setFrontlineRole] = useState<FrontlineRoleId>(defaults.frontlineRole);
  const [fieldReports, setFieldReports] = useState<FieldReport[]>(defaults.fieldReports);
  const [handoverNotes, setHandoverNotes] = useState<Record<FrontlineRoleId, string>>(defaults.handoverNotes);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const p = JSON.parse(raw) as Partial<Persisted>;
      if (p.scenarioId !== undefined) setScenarioId(p.scenarioId);
      if (p.actionStatus) setActionStatusState(p.actionStatus);
      if (p.decisions) setDecisions(p.decisions);
      if (p.recoveryDays) setRecoveryDays(p.recoveryDays);
      if (p.mode) setMode(p.mode);
      if (p.frontlineRole) setFrontlineRole(p.frontlineRole);
      if (p.fieldReports) setFieldReports(p.fieldReports);
      if (p.handoverNotes) setHandoverNotes({ ...emptyHandover, ...p.handoverNotes });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      const payload: Persisted = {
        scenarioId, actionStatus, decisions, recoveryDays,
        mode, frontlineRole, fieldReports, handoverNotes,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }, [scenarioId, actionStatus, decisions, recoveryDays, mode, frontlineRole, fieldReports, handoverNotes]);

  const commitScenario = useCallback((id: ScenarioId, decidedBy = "Office of the CFO") => {
    setScenarioId(id);
    const sc = scenarios.find((s) => s.id === id)!;
    setDecisions((prev) => [
      {
        id: `DEC-${Date.now()}`,
        scenarioId: id,
        decidedBy,
        decidedAt: Date.now(),
        status: "Committed",
        cash: sc.impact.cash,
        ebitda: sc.impact.ebitda,
      },
      ...prev,
    ]);
  }, []);

  const clearScenario = useCallback(() => setScenarioId(null), []);

  const setActionStatus = useCallback((id: string, status: ActionStatus, _dept: DepartmentId) => {
    setActionStatusState((prev) => ({ ...prev, [id]: status }));
  }, []);

  const resolveDecision = useCallback((id: string) => {
    setDecisions((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === "Committed" ? "In progress" : "Resolved" }
          : d
      )
    );
  }, []);

  const addFieldReport = useCallback(
    (r: Omit<FieldReport, "id" | "at" | "ack" | "converted">) => {
      setFieldReports((prev) => [
        { ...r, id: `FR-${Date.now()}`, at: Date.now(), ack: false, converted: false },
        ...prev,
      ]);
    },
    []
  );

  const ackFieldReport = useCallback((id: string) => {
    setFieldReports((prev) => prev.map((r) => (r.id === id ? { ...r, ack: true } : r)));
  }, []);

  const convertFieldReport = useCallback((id: string) => {
    setFieldReports((prev) => prev.map((r) => (r.id === id ? { ...r, converted: true, ack: true } : r)));
  }, []);

  const setHandoverNote = useCallback((role: FrontlineRoleId, note: string) => {
    setHandoverNotes((prev) => ({ ...prev, [role]: note }));
  }, []);

  const value = useMemo<DisruptionState>(
    () => ({
      disruption: seededDisruption,
      scenarioId,
      actionStatus,
      decisions,
      recoveryDays,
      mode,
      frontlineRole,
      fieldReports,
      handoverNotes,
      commitScenario,
      clearScenario,
      setActionStatus,
      setRecoveryDays,
      resolveDecision,
      setMode,
      setFrontlineRole,
      addFieldReport,
      ackFieldReport,
      convertFieldReport,
      setHandoverNote,
    }),
    [scenarioId, actionStatus, decisions, recoveryDays, mode, frontlineRole, fieldReports, handoverNotes,
     commitScenario, clearScenario, setActionStatus, resolveDecision,
     addFieldReport, ackFieldReport, convertFieldReport, setHandoverNote]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDisruption() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDisruption must be used inside DisruptionProvider");
  return v;
}
