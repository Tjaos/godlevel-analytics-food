"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";

interface ProductMargin {
  id: number;
  name: string;
  margin: number;
}

export default function LowMarginCard({ className = "" }) {
  const [products, setProducts] = useState<ProductMargin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMargins() {
      try {
        const res = await fetch("/api/analytics/low-margin-products?limit=10", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);

        const data = await res.json();
        console.log("📦 Resposta da API LowMargin:", data);

        // Detecta se veio array direto ou dentro de uma chave
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.lowMargin)) {
          setProducts(data.lowMargin);
        } else {
          setError("Formato inesperado de resposta da API.");
        }
      } catch (err) {
        console.error("❌ Erro ao buscar margens:", err);
        if (err instanceof Error) setError(err.message);
        else setError("Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchMargins();
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
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          Produtos com menor margem
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-blue-400 w-6 h-6" />
          </div>
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-slate-400 text-center">
            Nenhum produto com baixa margem 🎉
          </p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex flex-col bg-slate-800/70 hover:bg-slate-800 transition rounded-xl px-4 py-3"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-200 font-medium truncate max-w-[65%]">
                    {p.name}
                  </span>
                  <span
                    className={`font-bold text-lg ${
                      p.margin < 10
                        ? "text-red-400"
                        : p.margin < 20
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {p.margin.toFixed(1)}%
                  </span>
                </div>

                {/* Barra visual de margem */}
                <div className="relative w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-2 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(p.margin, 100)}%`,
                      backgroundColor:
                        p.margin < 10
                          ? "#ef4444"
                          : p.margin < 20
                          ? "#facc15"
                          : "#22c55e",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
