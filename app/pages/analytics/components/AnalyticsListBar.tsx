"use client";

interface AnalyticsListBarProps {
  name: string;
  totalSold: number;
  index: number;
}

export default function AnalyticsListBar({
  name,
  totalSold,
  index,
}: AnalyticsListBarProps) {
  const width = Math.min(totalSold / 10, 100);
  const color =
    totalSold < 5 ? "#ef4444" : totalSold < 15 ? "#facc15" : "#22c55e";

  return (
    <div className="flex flex-col bg-slate-800/70 hover:bg-slate-800 transition rounded-xl px-4 py-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-slate-200 font-medium truncate max-w-[70%]">
          {index + 1}. {name}
        </span>
        <span className="text-slate-300 font-semibold text-sm">
          {totalSold} vendid{totalSold === 1 ? "o" : "os"}
        </span>
      </div>
      <div className="relative w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-2 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
