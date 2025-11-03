"use client";

import { useRouter } from "next/navigation";
import { BarChart3, PieChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center py-16 px-6">
      {/* ===== Header ===== */}
      <div className="max-w-5xl w-full text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-3 text-green-400">
          🍽️ Analytics Food
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Inteligência para restaurantes: visualize dados de vendas, desempenho
          e comportamento de clientes em um só lugar.
        </p>
      </div>

      {/* ===== Botões principais ===== */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => router.push("/pages/analytics")}
          className="bg-blue-600 hover:bg-blue-500 text-lg px-8 py-6 rounded-xl shadow-md"
        >
          📊 Ver Análise Geral
        </Button>

        <Button
          onClick={() => router.push("/pages/sales")}
          className="bg-green-600 hover:bg-green-500 text-lg px-8 py-6 rounded-xl shadow-md"
        >
          💰 Ver Relatórios de Vendas
        </Button>
      </div>

      <p className="text-slate-600 text-sm mt-6">
        Dados atualizados em tempo real • Powered by Analytics Food
      </p>
    </main>
  );
}
