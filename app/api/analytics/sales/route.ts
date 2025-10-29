// app/api/analytics/sales/summary/route.ts
//rota: http://localhost:3000/api/analytics/sales?store=1&channel=iFood&from=2025-10-01&to=2025-10-29
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const store = searchParams.get("store");
    const channelName = searchParams.get("channel");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!store || !from || !to) {
      return NextResponse.json(
        { error: "Parâmetros store, from e to são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar id do canal pelo nome
    let channelId: number | undefined = undefined;
    if (channelName) {
      const channel = await db.channels.findFirst({
        where: { name: channelName },
      });
      channelId = channel?.id;
    }

    // Filtragem base
    const whereFilter = {
      store_id: Number(store),
      ...(channelId && { channel_id: channelId }),
      created_at: {
        gte: new Date(from),
        lte: new Date(to),
      },
    };

    // 1️⃣ Total de vendas e número de pedidos
    const salesAggregate = await db.sales.aggregate({
      _sum: { total_amount: true },
      _count: { id: true },
      where: whereFilter,
    });

    // Ensure numeric values (Prisma may return Decimal or null)
    const totalSales = Number(salesAggregate._sum.total_amount ?? 0);
    const totalOrders = Number(salesAggregate._count.id ?? 0);
    const avgTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

    // 2️⃣ Top 10 produtos mais vendidos
    const topProducts = await db.product_sales.groupBy({
      by: ["product_id"],
      where: {
        sales: whereFilter,
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
    });

    // Buscar nomes dos produtos separadamente (groupBy não suporta include)
    const productIds = topProducts.map((p) => p.product_id);
    const products = await db.products.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });
    const productNameById = new Map(products.map((pr) => [pr.id, pr.name]));

    return NextResponse.json({
      totalSales,
      totalOrders,
      avgTicket,
      topProducts: topProducts.map((p) => ({
        productId: p.product_id,
        name: productNameById.get(p.product_id) ?? null,
        quantitySold: p._sum.quantity,
      })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao gerar resumo de vendas" },
      { status: 500 }
    );
  }
}
