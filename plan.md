

## Goal
Make the dashboard valuable to **frontline employees** — mine operators, rail controllers, port handlers, HSE field officers, plant operators — not just the Governance/Treasury executive. Today the system is **read-down** (executives see what's wrong). We add a **read-up + act-down** loop so the ground crew **feeds reality in** and **receives clear instructions out**, closing the loop on the disruption response.

## What to add

### 1. Frontline Mode (role toggle in the sidebar)
A new toggle at the top of the sidebar: **Executive ⇄ Frontline**. Frontline mode strips the dashboard down to a phone-friendly, single-column view containing only what a person on shift needs. Same data, very different surface.

### 2. "My Shift" card (replaces the KPI grid in Frontline mode)
Big-type, glance-able card per role:
- **Sishen pit operator**: today's haul plan, throttle status ("ROM −8% in effect"), next shift handover at 14:00, 1 critical control to verify.
- **Rail controller**: current cycle time, next 3 train slots, "TFR escalation in flight — do not commit slot 14:30".
- **Saldanha port handler**: stockpile level, vessel queue, "3 vessel windows being rebooked — hold loader 2".
- **HSE field officer**: critical-control verification list with a one-tap **Verify / Flag** button per item.

This makes the committed scenario **legible at the rock face**, not just in the boardroom.

### 3. One-tap field reporting (the value flowing **up**)
A floating **"Report from field"** button (Frontline mode only) opens a 3-tap form:
- **What** (chip picker: Equipment down · Safety concern · Weather · Slot missed · Other)
- **Where** (auto-filled from role; editable)
- **Severity** (Low / Medium / HiPo)
- Optional 1-line note

Submitting:
- Adds a `FieldReport` to the `DisruptionContext`.
- If severity = HiPo → auto-escalates to Governance decision log and toasts the executive view.
- Appears as a new row in a **"Field signals"** strip on the Governance dashboard.

This is the **bidirectional** piece: the same screen the exec uses to push decisions down is the screen the operator uses to push reality up.

### 4. Field Signals strip (Governance-only)
A compact feed above the Decision Log showing the last 10 field reports with severity chip, role, timestamp, and a **"Acknowledge / Convert to action"** button. Converting a signal creates a new `PendingAction` routed to the relevant department — closing the loop end-to-end.

### 5. Shift handover note
At the bottom of every Frontline view: a **"Pass to next shift"** textarea that persists to context and appears pre-filled for the incoming shift. Small feature, huge real-world value — handover gaps cause most operational incidents.

### 6. Plain-language scenario translation
When a scenario is committed, Frontline users see a **plain-English instruction card** instead of the executive scorecard. Example for the Sishen operator under "Throttle":

> **Until further notice:** Reduce ROM by 8%. Prioritise lump feed. Next review: 14:00. Reason: rail recovery — Treasury covering demurrage. **You don't need to do anything about cash.**

This removes the cognitive load of interpreting financial impact at the pit.

## Technical approach
- **State**: extend `DisruptionContext` with `mode: "executive" | "frontline"`, `frontlineRole`, `fieldReports: FieldReport[]`, `handoverNotes: Record<role, string>`. Persist to `localStorage` (already wired).
- **Data**: add `src/data/frontline.ts` with role definitions, role→department mapping, and the plain-language instruction templates per scenario × role.
- **New components**:
  - `FrontlineShell.tsx` — single-column mobile-first layout swapped in via mode toggle.
  - `MyShiftCard.tsx` — role-specific glance card.
  - `ScenarioInstruction.tsx` — translates committed scenario → plain English for the active role.
  - `FieldReportSheet.tsx` — uses existing `ui/sheet.tsx` for the 3-tap form.
  - `FieldSignalsStrip.tsx` — Governance-only feed of field reports with convert-to-action.
  - `HandoverNote.tsx` — persisted textarea per role.
- **Sidebar**: add the Executive/Frontline toggle and a sub-picker for Frontline role.
- **Routing**: stay on `/` — the route renders `<FrontlineShell>` or the existing `<Dashboard>` based on context mode. No new route file needed.
- **Guided tour**: add a final stop — "Switch to Frontline mode" — so the demo shows the round-trip: exec commits scenario → operator sees plain-English instruction → operator files field report → exec sees signal → exec converts to action.

## Out of scope (unless you ask)
- Real authentication / per-user role assignment (toggle is demo-only)
- Native mobile app / push notifications
- Voice input or photo upload on field reports
- Offline-first sync for poor-connectivity sites

