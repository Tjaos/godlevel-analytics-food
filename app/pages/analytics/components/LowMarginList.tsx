"use client";
import AnalyticsListBar from "./AnalyticsListBar";

interface LowMarginListProps {
  products: { id: number; name: string; totalSold: number }[];
  loading: boolean;
  error: string | null;
}

export default function LowMarginList({
  products,
  loading,
  error,
}: LowMarginListProps) {
  if (loading)
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin text-blue-400 w-6 h-6 border-t-2 border-blue-400 rounded-full"></div>
      </div>
    );

  if (error) return <p className="text-red-400 text-center">{error}</p>;

  if (products.length === 0)
    return (
      <p className="text-slate-400 text-center">
        Nenhum produto com baixo volume de vendas 🎉
      </p>
    );

  return (
    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
      {products.slice(0, 10).map((p, i) => (
        <AnalyticsListBar
          key={p.id}
          name={p.name}
          totalSold={p.totalSold}
          index={i}
        />
      ))}
    </div>
  );
}
