"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Client {
  name: string;
  lastOrder: string;
}

export default function ChurnClientsCard({ className = "" }) {
  const [data, setData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChurnClients() {
      try {
        const res = await fetch("/api/analytics/churn-clients", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
        const result = await res.json();
        setData(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Erro ao buscar clientes inativos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchChurnClients();
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
          🚫 Clientes Inativos (30+ dias)
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-blue-400 w-6 h-6" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-slate-400 text-center">
            Nenhum cliente inativo encontrado 🎉
          </p>
        ) : (
          <div className="space-y-3">
            {data.slice(0, 10).map((client, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-slate-800/70 hover:bg-slate-800 transition rounded-xl px-4 py-3"
              >
                <span className="text-slate-200 font-medium truncate max-w-[60%]">
                  {client.name}
                </span>
                <span className="text-slate-400 text-sm">
                  {new Date(client.lastOrder).toLocaleDateString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
