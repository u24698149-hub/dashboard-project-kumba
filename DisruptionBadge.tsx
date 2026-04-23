import { useEffect, useState } from "react";
import { Clock, AlertOctagon } from "lucide-react";
import { useDisruption } from "@/context/DisruptionContext";

function formatDur(ms: number) {
  const sign = ms < 0 ? "-" : "";
  const abs = Math.abs(ms);
  const h = Math.floor(abs / 3_600_000);
  const m = Math.floor((abs % 3_600_000) / 60_000);
  return `${sign}${h}h ${m.toString().padStart(2, "0")}m`;
}

export function DisruptionBadge() {
  const { disruption } = useDisruption();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const sinceMs = now - disruption.detectedAt;
  const slaRemainingMs = disruption.slaMinutes * 60_000 - sinceMs;
  const overdue = slaRemainingMs < 0;

  const sevTone =
    disruption.severity === "P1"
      ? "bg-destructive text-white"
      : disruption.severity === "P2"
        ? "bg-gold text-navy"
        : "bg-white/15 text-white";

  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] font-display font-bold uppercase tracking-wider">
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${sevTone}`}>
        <AlertOctagon className="h-3 w-3" />
        Severity {disruption.severity}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-white/85">
        <Clock className="h-3 w-3" /> Detected {formatDur(sinceMs)} ago
      </span>
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
          overdue ? "bg-destructive text-white" : "bg-gold/20 text-gold"
        }`}
      >
        Treasury SLA · {overdue ? `Overdue ${formatDur(slaRemainingMs)}` : `${formatDur(slaRemainingMs)} left`}
      </span>
    </div>
  );
}
