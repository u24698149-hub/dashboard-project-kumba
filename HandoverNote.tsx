import { Textarea } from "@/components/ui/textarea";
import { useDisruption } from "@/context/DisruptionContext";
import { getFrontlineRole, type FrontlineRoleId } from "@/data/frontline";

export function HandoverNote({ roleId }: { roleId: FrontlineRoleId }) {
  const { handoverNotes, setHandoverNote } = useDisruption();
  const role = getFrontlineRole(roleId);
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="font-display text-base font-bold text-navy">Pass to next shift</h3>
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Auto-saved · {role.name}
        </span>
      </div>
      <Textarea
        value={handoverNotes[roleId] ?? ""}
        onChange={(e) => setHandoverNote(roleId, e.target.value)}
        rows={4}
        placeholder="Anything the next shift needs to know — equipment quirks, open flags, in-progress work…"
      />
    </section>
  );
}
