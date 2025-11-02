import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const byChannel = await db.sales.groupBy({
      by: ["channel_id"],
      _avg: { total_amount: true },
    });

    const channels = await db.channels.findMany();
    const mapped = byChannel.map((c) => ({
      channel:
        channels.find((ch) => ch.id === c.channel_id)?.name || "Desconhecido",
      avgTicket: c._avg.total_amount || 0,
    }));

    return NextResponse.json(mapped);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao buscar ticket médio" },
      { status: 500 }
    );
  }
}
