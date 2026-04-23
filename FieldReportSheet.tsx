import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Radio } from "lucide-react";
import { useDisruption, type FieldKind, type FieldSeverity } from "@/context/DisruptionContext";
import { getFrontlineRole } from "@/data/frontline";
import { toast } from "sonner";

const kinds: FieldKind[] = ["Equipment down", "Safety concern", "Weather", "Slot missed", "Other"];
const severities: FieldSeverity[] = ["Low", "Medium", "HiPo"];

export function FieldReportSheet() {
  const { frontlineRole, addFieldReport } = useDisruption();
  const role = getFrontlineRole(frontlineRole);
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<FieldKind | null>(null);
  const [where, setWhere] = useState(role.location);
  const [severity, setSeverity] = useState<FieldSeverity | null>(null);
  const [note, setNote] = useState("");

  const reset = () => {
    setKind(null);
    setSeverity(null);
    setNote("");
    setWhere(role.location);
  };

  const submit = () => {
    if (!kind || !severity) {
      toast.error("Pick a category and severity");
      return;
    }
    addFieldReport({ role: frontlineRole, dept: role.dept, kind, where, severity, note: note || undefined });
    if (severity === "HiPo") {
      toast.error("HiPo escalated to Governance", { description: `${kind} · ${where}` });
    } else {
      toast.success("Field report sent", { description: `${kind} · ${severity}` });
    }
    reset();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <SheetTrigger asChild>
        <button
          className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-[color:var(--danger)] px-5 py-3 text-sm font-display font-bold uppercase tracking-wider text-white shadow-[var(--shadow-elegant)] hover:opacity-90"
          aria-label="Report from field"
        >
          <Radio className="h-4 w-4" /> Report from field
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto sm:max-w-xl sm:mx-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-xl text-navy">Report from field</SheetTitle>
          <SheetDescription>3 taps. Goes straight to Governance.</SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-5">
          <div>
            <div className="mb-2 font-display text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              1 · What
            </div>
            <div className="flex flex-wrap gap-2">
              {kinds.map((k) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={`rounded-full px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wider transition-all ${
                    kind === k
                      ? "bg-navy text-white"
                      : "border border-border bg-background text-foreground hover:border-gold/60"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 font-display text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              2 · Where
            </div>
            <input
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div>
            <div className="mb-2 font-display text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              3 · Severity
            </div>
            <div className="flex gap-2">
              {severities.map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`flex-1 rounded-md px-3 py-2.5 text-sm font-display font-bold uppercase tracking-wider transition-all ${
                    severity === s
                      ? s === "HiPo"
                        ? "bg-[color:var(--danger)] text-white"
                        : s === "Medium"
                        ? "bg-[color:var(--warning)] text-navy"
                        : "bg-navy text-white"
                      : "border border-border bg-background text-foreground hover:border-gold/60"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 font-display text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Optional note
            </div>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="One line of context"
            />
          </div>

          <button
            onClick={submit}
            className="w-full rounded-md bg-navy px-4 py-3 font-display text-sm font-bold uppercase tracking-wider text-white hover:bg-navy-deep"
          >
            Send report
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
