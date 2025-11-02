import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const sales = await db.sales.findMany({
      select: { created_at: true, delivery_seconds: true },
    });

    const grouped: Record<string, number[]> = {};
    sales.forEach((s) => {
      const d = new Date(s.created_at);
      const key = `${d.getDay()}-${d.getHours()}`;
      grouped[key] = grouped[key] || [];
      grouped[key].push(s.delivery_seconds || 0);
    });

    const stats = Object.entries(grouped).map(([key, values]) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const [day, hour] = key.split("-");
      return {
        day: Number(day),
        hour: Number(hour),
        avgTime: Math.round(avg / 60),
      }; // em minutos
    });

    return NextResponse.json(stats);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao calcular tempo de entrega" },
      { status: 500 }
    );
  }
}
