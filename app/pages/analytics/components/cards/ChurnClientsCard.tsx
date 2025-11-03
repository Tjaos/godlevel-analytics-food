"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface Client {
  name: string;
  lastOrder: string;
  lastStore: string;
  daysInactive: number;
}

export default function ChurnClientsCard({ className = "" }) {
  const [data, setData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  async function fetchChurnClients() {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchChurnClients();
  }, []);

  const totalInativos = data.length;
  const topInativos = data.slice(0, 10);

  return (
    <>
      {/* ===== CARD PRINCIPAL ===== */}
      <Card
        onClick={() => setOpen(true)}
        className={`cursor-pointer w-full max-w-[850px] min-h-[260px]
          bg-slate-900/90 border border-slate-800 text-slate-100
          rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.01]
          transition-all duration-300 ease-in-out ${className}`}
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
          ) : totalInativos === 0 ? (
            <p className="text-slate-400 text-center">
              Nenhum cliente inativo encontrado 🎉
            </p>
          ) : (
            <>
              <div className="text-center text-3xl font-bold text-yellow-400">
                {totalInativos}
              </div>
              <p className="text-center text-slate-400 text-sm">
                Clientes sem comprar há mais de 30 dias
              </p>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {topInativos.map((client, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-slate-800/70 hover:bg-slate-800 transition rounded-xl px-4 py-3"
                  >
                    <div className="flex flex-col">
                      <span className="text-slate-200 font-medium truncate max-w-[250px]">
                        {i + 1}. {client.name}
                      </span>
                      <span className="text-slate-400 text-xs truncate max-w-[250px]">
                        {client.lastStore} •{" "}
                        {new Date(client.lastOrder).toLocaleDateString("pt-BR")}
                      </span>
                    </div>

                    <span
                      className={`font-bold text-sm ${
                        client.daysInactive > 90
                          ? "text-red-400"
                          : client.daysInactive > 60
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {client.daysInactive} dias
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ===== MODAL DETALHADO ===== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl bg-slate-900 border border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Clientes Inativos (30+ dias)
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-blue-400 w-6 h-6" />
            </div>
          ) : data.length === 0 ? (
            <p className="text-slate-400 text-center py-6">
              Nenhum cliente inativo encontrado 🎉
            </p>
          ) : (
            <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-2">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-2">
                <span className="text-slate-400 font-medium">Cliente</span>
                <span className="text-slate-400 font-medium">
                  Última Loja / Compra / Inatividade
                </span>
              </div>

              {data.map((client, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-slate-800/70 hover:bg-slate-800 transition rounded-xl px-4 py-3"
                >
                  <div className="flex flex-col">
                    <span className="text-slate-200 font-medium truncate max-w-[260px]">
                      {i + 1}. {client.name}
                    </span>
                    <span className="text-slate-400 text-xs truncate max-w-[260px]">
                      {client.lastStore} •{" "}
                      {new Date(client.lastOrder).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <span
                    className={`font-bold text-sm ${
                      client.daysInactive > 90
                        ? "text-red-400"
                        : client.daysInactive > 60
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {client.daysInactive} dias
                  </span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
