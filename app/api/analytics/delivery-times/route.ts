import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const store = searchParams.get("store");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const mode = searchParams.get("mode"); // 👈 novo: "summary" (para o card principal)

    const where: Prisma.salesWhereInput = {};
    if (store) where.store_id = Number(store);
    if (from && to) {
      where.created_at = { gte: new Date(from), lte: new Date(to) };
    }

    const sales = await db.sales.findMany({
      where,
      select: { created_at: true, delivery_seconds: true },
    });

    if (sales.length === 0) return NextResponse.json([]);

    // 🔹 Agrupa por dia/hora
    const grouped: Record<string, number[]> = {};
    for (const s of sales) {
      if (!s.delivery_seconds || s.delivery_seconds <= 0) continue;
      const d = new Date(s.created_at);
      const key = `${d.getDay()}-${d.getHours()}`;
      grouped[key] = grouped[key] || [];
      grouped[key].push(s.delivery_seconds);
    }

    const hourlyStats = Object.entries(grouped).map(([key, values]) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const [day, hour] = key.split("-");
      return {
        day: Number(day),
        hour: Number(hour),
        avgTime: Math.round(avg / 60), // minutos
      };
    });

    // 🔹 Se o modo for "summary", agregamos novamente por dia (média geral do dia)
    if (mode === "summary") {
      const daily: Record<number, number[]> = {};
      for (const s of hourlyStats) {
        daily[s.day] = daily[s.day] || [];
        daily[s.day].push(s.avgTime);
      }

      const summary = Object.entries(daily).map(([day, list]) => ({
        day: Number(day),
        avgTime: list.reduce((acc, v) => acc + v, 0) / (list.length || 1),
      }));

      return NextResponse.json(summary);
    }

    // 🔹 Se não for summary, retorna detalhado (para o modal)
    return NextResponse.json(hourlyStats);
  } catch (err) {
    console.error("❌ Erro ao calcular tempo médio de entrega:", err);
    return NextResponse.json(
      { error: "Erro ao calcular tempo médio de entrega" },
      { status: 500 }
    );
  }
}
