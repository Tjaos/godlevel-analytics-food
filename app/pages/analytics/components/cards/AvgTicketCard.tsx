"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, PieChart as PieChartIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChannelTicket {
  channel: string;
  avgTicket: number;
}

interface Store {
  id: number;
  name: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);

export default function AvgTicketCard({ className = "" }) {
  const [data, setData] = useState<ChannelTicket[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [totalAvg, setTotalAvg] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  async function fetchAvgTicket() {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (selectedStore) params.set("store", selectedStore);
      if (fromDate && toDate) {
        params.set("from", fromDate);
        params.set("to", toDate);
      }

      const res = await fetch(
        `/api/analytics/ticket-average?${params.toString()}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
      const result = await res.json();

      const normalized: ChannelTicket[] = (result.byChannel || []).map(
        (r: any) => ({
          channel: r.channel,
          avgTicket:
            typeof r.avgTicket === "number"
              ? r.avgTicket
              : parseFloat(String(r.avgTicket).replace(",", ".")) || 0,
        })
      );

      setData(normalized);
      setTotalAvg(result.avgTicket || 0);
      setStores(result.byStore || []);
    } catch (error) {
      console.error("Erro ao buscar ticket médio:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAvgTicket();
  }, []);

  return (
    <>
      {/* ===== CARD PRINCIPAL ===== */}
      <Card
        onClick={() => setOpen(true)}
        className={`cursor-pointer w-full max-w-[850px] min-h-[300px]
          bg-slate-900/90 border border-slate-800 text-slate-100
          rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.01]
          transition-all duration-300 ease-in-out ${className}`}
      >
        <CardHeader className="flex justify-between items-center pb-2">
          <CardTitle className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-blue-400" />
            Ticket Médio por Canal
          </CardTitle>
          <span className="text-sm text-slate-400">Clique para detalhes</span>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-blue-400 w-6 h-6" />
            </div>
          ) : data.length === 0 ? (
            <p className="text-slate-400 text-center">
              Nenhum dado encontrado.
            </p>
          ) : (
            <>
              <div className="text-center mb-4">
                <p className="text-slate-400 text-sm">Ticket médio geral</p>
                <h3 className="text-3xl font-bold text-green-400">
                  {formatCurrency(totalAvg)}
                </h3>
              </div>

              {/* Lista por canal */}
              <div className="space-y-3">
                {data.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-slate-800/70 hover:bg-slate-800 transition rounded-xl px-4 py-3"
                  >
                    <span className="text-slate-200 font-medium">
                      {item.channel}
                    </span>
                    <span className="text-green-400 font-semibold">
                      {formatCurrency(item.avgTicket)}
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
            <DialogTitle className="text-xl font-semibold flex justify-between items-center">
              <span>Ticket Médio Detalhado</span>
            </DialogTitle>
          </DialogHeader>

          {/* FILTROS */}
          <div className="grid grid-cols-[160px_1fr_1fr_120px] gap-4 mt-4 items-end">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Select
                    onValueChange={setSelectedStore}
                    value={selectedStore}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200 truncate w-full md:w-[160px]">
                      <SelectValue
                        placeholder="Loja"
                        className="truncate text-ellipsis whitespace-nowrap"
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-slate-200 max-h-[300px]">
                      {stores.map((store) => (
                        <SelectItem
                          key={store.id}
                          value={String(store.id)}
                          className="truncate text-ellipsis whitespace-nowrap"
                        >
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TooltipTrigger>
                {selectedStore && (
                  <TooltipContent className="bg-slate-800 text-slate-100 border border-slate-700 text-sm px-3 py-1 rounded-md shadow-lg">
                    {stores.find((s) => String(s.id) === selectedStore)?.name}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-slate-800 border-slate-700 text-slate-200"
            />
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-slate-800 border-slate-700 text-slate-200"
            />

            <Button
              onClick={fetchAvgTicket}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Filtrar"
              )}
            </Button>
          </div>

          {/* NOME DA LOJA E PERÍODO */}
          {selectedStore && !loading && (
            <div className="text-center mt-8 mb-4 space-y-1">
              <h2 className="text-2xl font-semibold text-slate-100">
                {stores.find((s) => String(s.id) === selectedStore)?.name}
              </h2>
              <div className="w-24 h-[2px] bg-blue-500 mx-auto mt-1 rounded-full" />
              {(fromDate || toDate) && (
                <p className="text-slate-400 text-sm mt-2">
                  Período:{" "}
                  {fromDate ? (
                    <span className="text-slate-300">
                      {new Date(fromDate).toLocaleDateString("pt-BR")}
                    </span>
                  ) : (
                    "—"
                  )}{" "}
                  até{" "}
                  {toDate ? (
                    <span className="text-slate-300">
                      {new Date(toDate).toLocaleDateString("pt-BR")}
                    </span>
                  ) : (
                    "—"
                  )}
                </p>
              )}
            </div>
          )}

          {/* LISTA DETALHADA */}
          <div className="mt-6 space-y-3 max-h-[450px] overflow-y-auto pr-2">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-blue-400 w-6 h-6" />
              </div>
            ) : data.length === 0 ? (
              <p className="text-slate-400 text-center py-6">
                Nenhum dado encontrado.
              </p>
            ) : (
              <>
                <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
                  <span className="text-slate-400 font-medium">
                    Canal de Venda
                  </span>
                  <span className="text-slate-400 font-medium">
                    Ticket Médio
                  </span>
                </div>

                {data.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-slate-800/70 hover:bg-slate-800 transition rounded-xl px-4 py-3"
                  >
                    <span className="text-slate-200 font-medium">
                      {item.channel}
                    </span>
                    <span className="text-green-400 font-bold text-lg">
                      {formatCurrency(item.avgTicket)}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
