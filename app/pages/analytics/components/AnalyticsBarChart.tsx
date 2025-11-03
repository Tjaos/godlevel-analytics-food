"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import DarkTooltip from "./charts/DarkTooltip";

interface AnalyticsBarChartProps {
  data: any[];
  dataKey: string;
  labelKey: string;
  color: string;
  onBarClick?: (name: string) => void;
}

export default function AnalyticsBarChart({
  data,
  dataKey,
  labelKey,
  color,
  onBarClick,
}: AnalyticsBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" barCategoryGap="15%">
        <XAxis type="number" hide />
        <YAxis
          dataKey={labelKey}
          type="category"
          width={180}
          tick={{
            fill: "#e2e8f0",
            fontSize: 13,
            fontWeight: 500,
          }}
          tickFormatter={(v) => (v.length > 18 ? `${v.slice(0, 18)}…` : v)}
        />
        <Tooltip content={<DarkTooltip />} />
        <Bar
          dataKey={dataKey}
          radius={[4, 4, 4, 4]}
          isAnimationActive
          animationDuration={700}
        >
          {data.map((d, i) => (
            <Cell
              key={i}
              cursor={onBarClick ? "pointer" : "default"}
              onClick={() => onBarClick?.(d[labelKey])}
              fill={color}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
