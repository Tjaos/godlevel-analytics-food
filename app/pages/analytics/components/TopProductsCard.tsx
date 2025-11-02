"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Trophy } from "lucide-react";

interface Product {
  name: string;
  quantity: number;
}

export default function TopProductsCard({ className = "" }) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopProducts() {
      try {
        const res = await fetch("/api/analytics/top-products?channel=iFood", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
        const result = await res.json();
        setData(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Erro ao buscar top produtos:", error);
        setError("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    }

    fetchTopProducts();
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
          <Trophy className="w-5 h-5 text-yellow-400" />
          Top Produtos (quinta à noite - iFood)
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-blue-400 w-6 h-6" />
          </div>
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-slate-400 text-center">
            Nenhum produto encontrado 📭
          </p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {data.slice(0, 10).map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-slate-800/70 hover:bg-slate-800 transition rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-bold">#{i + 1}</span>
                  <span className="text-slate-200 font-medium truncate max-w-[60%]">
                    {item.name}
                  </span>
                </div>
                <span className="text-green-400 font-bold text-lg">
                  {item.quantity}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
