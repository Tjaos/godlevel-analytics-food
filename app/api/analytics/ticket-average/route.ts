import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const store = searchParams.get("store");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: Prisma.salesWhereInput = {};
    if (store) where.store_id = Number(store);
    if (from && to)
      where.created_at = { gte: new Date(from), lte: new Date(to) };

    const agg = await db.sales.aggregate({
      where,
      _sum: { total_amount: true },
      _count: { id: true },
    });

    const totalSales = Number(agg._sum.total_amount ?? 0);
    const totalOrders = Number(agg._count.id ?? 0);
    const avgTicket = totalOrders ? totalSales / totalOrders : 0;

    // breakdown by channel
    const byChannel = await db.sales.groupBy({
      by: ["channel_id"],
      where,
      _sum: { total_amount: true },
      _count: { id: true },
      orderBy: { _sum: { total_amount: "desc" } },
    });

    // Map channel_id -> name
    const channelIds = byChannel
      .map((b) => b.channel_id)
      .filter(Boolean) as number[];
    const channels = await db.channels.findMany({
      where: { id: { in: channelIds } },
    });
    const channelById = new Map(channels.map((c) => [c.id, c.name]));

    const byChannelFormatted = byChannel.map((b) => ({
      channel: channelById.get(b.channel_id as number) ?? `${b.channel_id}`,
      totalSales: Number(b._sum.total_amount ?? 0),
      orders: Number(b._count.id ?? 0),
      avgTicket: Number(b._count.id ?? 0)
        ? Number(b._sum.total_amount ?? 0) / Number(b._count.id ?? 1)
        : 0,
    }));

    // optional by store
    const byStore = await db.stores.findMany({
      where: {
        /* could filter to stores of the brand */
      },
      select: { id: true, name: true },
    });

    return NextResponse.json({
      totalSales,
      totalOrders,
      avgTicket,
      byChannel: byChannelFormatted,
      byStore: byStore, // light info (frontend can request more if needed)
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao calcular avg ticket" },
      { status: 500 }
    );
  }
}
