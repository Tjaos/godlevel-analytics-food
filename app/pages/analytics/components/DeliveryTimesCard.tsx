"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Clock } from "lucide-react";

interface DeliveryData {
  day: number;
  hour: number;
  avgTime: number;
}

export default function DeliveryTimesCard({ className = "" }) {
  const [data, setData] = useState<DeliveryData[]>([]);
  const [loading, setLoading] = useState(true);

  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  useEffect(() => {
    async function fetchDeliveryTimes() {
      try {
        const res = await fetch("/api/analytics/delivery-times", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
        const result = await res.json();
        setData(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Erro ao buscar tempos de entrega:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDeliveryTimes();
  }, []);

  return (
    <Card
      className={`
        w-full
        max-w-[850px]
        min-h-[260px]
        bg-slate-900/90
        border border-slate-800
        text-slate-100
        rounded-2xl
        shadow-lg
        hover:shadow-2xl
        hover:scale-[1.01]
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Tempo Médio de Entrega
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-blue-400 w-6 h-6" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-slate-400 text-center">
            Nenhum dado de entrega disponível 📭
          </p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {data.slice(0, 10).map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-slate-800/70 hover:bg-slate-800 transition rounded-xl px-4 py-3"
              >
                <span className="text-slate-200 font-medium">
                  {days[item.day] ?? "?"} • {item.hour}h
                </span>
                <span
                  className={`font-bold text-lg ${
                    item.avgTime > 40
                      ? "text-red-400"
                      : item.avgTime > 25
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {item.avgTime.toFixed(1)} min
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
