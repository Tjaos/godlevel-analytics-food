"use client";
import AnalyticsListRow from "./AnalyticsListRow";

interface AnalyticsListProps {
  data: {
    title: string;
    subtitle?: string;
    value: string;
    color?: "green" | "yellow" | "red";
  }[];
  loading: boolean;
  emptyMessage?: string;
  maxHeight?: string;
}

export default function AnalyticsList({
  data,
  loading,
  emptyMessage = "Nenhum dado encontrado.",
  maxHeight = "450px",
}: AnalyticsListProps) {
  if (loading)
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin text-blue-400 w-6 h-6 border-t-2 border-blue-400 rounded-full"></div>
      </div>
    );

  if (data.length === 0)
    return <p className="text-slate-400 text-center py-6">{emptyMessage}</p>;

  return (
    <div className="space-y-3 overflow-y-auto pr-2" style={{ maxHeight }}>
      {data.map((item, i) => (
        <AnalyticsListRow
          key={i}
          label={item.title}
          value={Number(item.value)}
          unit={item.subtitle}
        />
      ))}
    </div>
  );
}
