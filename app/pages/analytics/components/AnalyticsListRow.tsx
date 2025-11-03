"use client";

interface AnalyticsListRowProps {
  label: string;
  value: number;
  unit?: string;
}

export default function AnalyticsListRow({
  label,
  value,
  unit = "min",
}: AnalyticsListRowProps) {
  const color =
    value > 40
      ? "text-red-400"
      : value > 25
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <div className="flex justify-between items-center bg-slate-800/70 hover:bg-slate-800 transition rounded-xl px-4 py-3">
      <span className="text-slate-200 font-medium">{label}</span>
      <span className={`font-bold text-lg ${color}`}>
        {value.toFixed(1)} {unit}
      </span>
    </div>
  );
}
