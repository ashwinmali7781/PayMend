import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function CategoryChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = data.map((d) => ({
    label: d.label,
    Recovered: d.recovered,
    Unresolved: d.count - d.recovered,
  }));

  return (
    <div className="panel">
      <div className="panel-title">Failures by cause</div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--hairline)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--ink-dim)", fontSize: 11, fontFamily: "var(--mono)" }}
            axisLine={{ stroke: "var(--hairline)" }}
            tickLine={false}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={70}
          />
          <YAxis
            tick={{ fill: "var(--ink-dim)", fontSize: 11, fontFamily: "var(--mono)" }}
            axisLine={{ stroke: "var(--hairline)" }}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--panel-raised)",
              border: "1px solid var(--hairline)",
              borderRadius: 6,
              fontFamily: "var(--mono)",
              fontSize: 12,
            }}
            cursor={{ fill: "var(--gold-soft)" }}
          />
          <Bar dataKey="Recovered" stackId="a" fill="var(--recovered)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Unresolved" stackId="a" fill="var(--chart-muted)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
