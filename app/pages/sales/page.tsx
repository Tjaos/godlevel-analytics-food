"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  ShoppingBag,
  Receipt,
  DollarSign,
  Trophy,
} from "lucide-react";

interface TopProduct {
  productId: number;
  name: string;
  quantitySold: number;
}

interface SalesData {
  totalSales: number;
  totalOrders: number;
  avgTicket: number;
  topProducts: TopProduct[];
}

export default function Sales() {
  const [data, setData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/analytics/sales", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Falha ao carregar dados de vendas.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-slate-950">
        <Loader2 className="animate-spin w-10 h-10 text-blue-400" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-slate-950">
        <p className="text-red-400 text-lg">
          {error || "Nenhum dado encontrado."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center text-slate-100 tracking-tight">
          📊 Resumo de Vendas
        </h1>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 flex flex-col items-center hover:scale-[1.02]">
            <ShoppingBag className="w-8 h-8 mb-2 text-blue-400" />
            <h2 className="text-lg font-medium text-slate-300">
              Total de Vendas
            </h2>
            <p className="text-3xl font-bold text-slate-100 mt-1">
              R$
              {data.totalSales.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 flex flex-col items-center hover:scale-[1.02]">
            <Receipt className="w-8 h-8 mb-2 text-emerald-400" />
            <h2 className="text-lg font-medium text-slate-300">
              Total de Pedidos
            </h2>
            <p className="text-3xl font-bold text-slate-100 mt-1">
              {data.totalOrders}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 flex flex-col items-center hover:scale-[1.02]">
            <DollarSign className="w-8 h-8 mb-2 text-yellow-400" />
            <h2 className="text-lg font-medium text-slate-300">Ticket Médio</h2>
            <p className="text-3xl font-bold text-slate-100 mt-1">
              R$
              {data.avgTicket.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Tabela de Produtos mais vendidos */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="text-yellow-400 w-6 h-6" />
            <h2 className="text-2xl font-semibold tracking-tight">
              Top 10 Produtos Mais Vendidos
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-slate-400 text-sm border-b border-slate-700">
                  <th className="text-left py-3 px-4">#</th>
                  <th className="text-left py-3 px-4">Produto</th>
                  <th className="text-right py-3 px-4">Quantidade Vendida</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((product, index) => (
                  <tr
                    key={product.productId}
                    className="hover:bg-slate-800/60 transition"
                  >
                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 text-slate-200 font-medium truncate max-w-[300px]">
                      {product.name || "Produto Desconhecido"}
                    </td>
                    <td className="py-3 px-4 text-right text-green-400 font-semibold">
                      {product.quantitySold}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
