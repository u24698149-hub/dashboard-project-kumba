import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartSeries } from "@/data/departments";

const NAVY = "#0A2240";
const GOLD = "#C8A951";

export function DeptChart({ chart }: { chart: ChartSeries }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-display text-base font-bold text-navy">{chart.title}</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Legend a={chart.legend.a} b={chart.legend.b} />
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chart.type === "line" ? (
            <LineChart data={chart.data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="a" stroke={NAVY} strokeWidth={2.5} dot={{ r: 3 }} />
              {chart.legend.b && (
                <Line type="monotone" dataKey="b" stroke={GOLD} strokeWidth={2.5} dot={{ r: 3 }} />
              )}
            </LineChart>
          ) : chart.type === "bar" ? (
            <BarChart data={chart.data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="a" fill={NAVY} radius={[4, 4, 0, 0]} />
              {chart.legend.b && <Bar dataKey="b" fill={GOLD} radius={[4, 4, 0, 0]} />}
            </BarChart>
          ) : (
            <AreaChart data={chart.data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="navy-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={NAVY} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={NAVY} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gold-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="a" stroke={NAVY} strokeWidth={2} fill="url(#navy-grad)" />
              {chart.legend.b && (
                <Area type="monotone" dataKey="b" stroke={GOLD} strokeWidth={2} fill="url(#gold-grad)" />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "#0A2240",
  border: "none",
  borderRadius: 8,
  color: "#fff",
  fontSize: 12,
};

function Legend({ a, b }: { a: string; b?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: NAVY }} />
        {a}
      </span>
      {b && (
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: GOLD }} />
          {b}
        </span>
      )}
    </div>
  );
}
