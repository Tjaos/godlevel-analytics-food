"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ChannelTicket {
  channel: string;
  avgTicket: number;
}

export default function AvgTicketCard({ className = "" }) {
  const [data, setData] = useState<ChannelTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAvgTicket() {
      try {
        const res = await fetch("/api/analytics/ticket-average", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
        const result = await res.json();
        // Normalize avgTicket to number (API may return it as string)
        const normalized: ChannelTicket[] = (
          Array.isArray(result) ? result : []
        ).map((r: any) => ({
          channel: r.channel,
          avgTicket:
            typeof r.avgTicket === "number"
              ? r.avgTicket
              : parseFloat(String(r.avgTicket).replace(",", ".")) || 0,
        }));
        setData(normalized);
      } catch (error) {
        console.error("Erro ao buscar ticket médio:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAvgTicket();
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
          💰 Ticket Médio por Canal
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-blue-400 w-6 h-6" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-slate-400 text-center">Nenhum dado encontrado.</p>
        ) : (
          <div className="space-y-3">
            {data.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-slate-800/70 hover:bg-slate-800 transition rounded-xl px-4 py-3"
              >
                <span className="text-slate-200 font-medium">
                  {item.channel}
                </span>
                <span className="text-green-400 font-bold text-lg">
                  R$ {item.avgTicket.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
