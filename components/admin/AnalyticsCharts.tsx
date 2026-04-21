"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Point {
  date: string;
  value: number;
}

const formatDay = (d: unknown) => {
  if (typeof d !== "string") return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  return `${String(dt.getUTCDate()).padStart(2, "0")}/${String(dt.getUTCMonth() + 1).padStart(2, "0")}`;
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#111] border border-[#222] rounded-2xl p-5">
      <h3
        className="text-sm text-gray-400 uppercase tracking-wide mb-4"
        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
      >
        {title}
      </h3>
      <div className="h-56 w-full">{children}</div>
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "#0A0A0A",
  border: "1px solid #333",
  borderRadius: "8px",
  fontSize: "12px",
};
const axisStyle = { fontSize: 11, fill: "#666" };

export function ViewsChart({ data }: { data: Point[] }) {
  return (
    <ChartCard title="Προβολές (τελευταίες 30 ημέρες)">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
          <XAxis dataKey="date" tickFormatter={formatDay} tick={axisStyle} tickLine={false} axisLine={false} />
          <YAxis tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={tooltipStyle}
            labelFormatter={formatDay}
            formatter={(v) => [v as number, "Προβολές"] as [number, string]}
          />
          <Area type="monotone" dataKey="value" stroke="#F97316" strokeWidth={2} fill="url(#viewsFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SubscribersChart({ data }: { data: Point[] }) {
  return (
    <ChartCard title="Εγγραφές Newsletter (τελευταίες 30 ημέρες)">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
          <XAxis dataKey="date" tickFormatter={formatDay} tick={axisStyle} tickLine={false} axisLine={false} />
          <YAxis tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={tooltipStyle}
            labelFormatter={formatDay}
            formatter={(v) => [v as number, "Εγγραφές"] as [number, string]}
          />
          <Line type="monotone" dataKey="value" stroke="#38BDF8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function RatingsChart({ data }: { data: Point[] }) {
  return (
    <ChartCard title="Αξιολογήσεις (τελευταίες 30 ημέρες)">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
          <XAxis dataKey="date" tickFormatter={formatDay} tick={axisStyle} tickLine={false} axisLine={false} />
          <YAxis tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={tooltipStyle}
            labelFormatter={formatDay}
            formatter={(v) => [v as number, "Αξιολογήσεις"] as [number, string]}
          />
          <Bar dataKey="value" fill="#FACC15" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
