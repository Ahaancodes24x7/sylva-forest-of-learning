import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { decaySeries, type Concept } from "@/data/sylva";

export function DecayChart({ concept, height = 170 }: { concept: Concept; height?: number }) {
  const data = decaySeries(concept);
  const gid = `decay-${concept.id}`;

  return (
    <div style={{ height }} aria-label={`Projected mastery for ${concept.name} over the next 30 days`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 6, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`${gid}-r`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border)" strokeOpacity={0.35} vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(d: number) => (d === 0 ? "today" : `+${d}d`)}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            width={38}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
              fontSize: 12,
              boxShadow: "var(--shadow-soft)",
            }}
            formatter={(v: number, name) => [`${v}%`, name === "mastery" ? "If left alone" : "If reviewed now"]}
            labelFormatter={(d: number) => (d === 0 ? "Today" : `In ${d} days`)}
          />
          <Area
            type="monotone"
            dataKey="withReview"
            stroke="var(--color-chart-3)"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill={`url(#${gid}-r)`}
          />
          <Area type="monotone" dataKey="mastery" stroke="var(--color-chart-2)" strokeWidth={2.4} fill={`url(#${gid})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
