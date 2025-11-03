"use client";
import AnalyticsListRow from "./AnalyticsListRow";

interface DeliveryListProps {
  data: { day: number; hour?: number; avgTime: number }[];
  loading: boolean;
  days: string[];
  detailed?: boolean;
}

export default function DeliveryList({
  data,
  loading,
  days,
  detailed,
}: DeliveryListProps) {
  if (loading)
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin text-blue-400 w-6 h-6 border-t-2 border-blue-400 rounded-full"></div>
      </div>
    );

  if (data.length === 0)
    return (
      <p className="text-slate-400 text-center py-6">
        Nenhum dado encontrado 📭
      </p>
    );

  return (
    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
      {data.map((item, i) => (
        <AnalyticsListRow
          key={i}
          label={
            detailed ? `${days[item.day]} • ${item.hour}h` : days[item.day]
          }
          value={item.avgTime}
        />
      ))}
    </div>
  );
}
