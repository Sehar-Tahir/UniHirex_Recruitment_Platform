import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { COLORS } from "../../../../theme";

const tick = { fontSize: 11, fill: COLORS.textMuted };

export function TrendLines({ data, lines }) {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F8" />
          <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} tick={tick} minTickGap={28} />
          <YAxis allowDecimals={false} tick={tick} />
          <Tooltip />
          <Legend />
          {lines.map((l) => (
            <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HBars({ data, yKey, bars }) {
  const height = Math.max(180, data.length * 40 + 40);
  const shorten = (v) => (String(v).length > 16 ? `${String(v).slice(0, 15)}…` : v);

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F8" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={tick} />
          <YAxis type="category" dataKey={yKey} width={110} tickFormatter={shorten} tick={{ fontSize: 12, fill: COLORS.textDark }} />
          <Tooltip />
          {bars.length > 1 && <Legend />}
          {bars.map((b) => (
            <Bar key={b.key} dataKey={b.key} name={b.name} fill={b.color} radius={[0, 4, 4, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}