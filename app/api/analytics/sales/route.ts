import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const store = searchParams.get("store");
    const channelName = searchParams.get("channel");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // Filtro base dinâmico
    const where: Prisma.salesWhereInput = {};

    if (store) where.store_id = Number(store);

    // Apenas aplica o filtro de data se ambos os parâmetros existirem
    if (from && to) {
      where.created_at = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    // Buscar id do canal (se informado)
    let channelId: number | undefined;
    if (channelName) {
      const channel = await db.channels.findFirst({
        where: { name: channelName },
      });
      channelId = channel?.id;
      if (channelId) where.channel_id = channelId;
    }

    // 1️⃣ Agregados principais
    const salesAggregate = await db.sales.aggregate({
      _sum: { total_amount: true },
      _count: { id: true },
      where,
    });

    const totalSales = Number(salesAggregate._sum.total_amount ?? 0);
    const totalOrders = Number(salesAggregate._count.id ?? 0);
    const avgTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

    // 2️⃣ Top 10 produtos mais vendidos
    const topProducts = await db.product_sales.groupBy({
      by: ["product_id"],
      where: {
        sales: where, // Reutiliza o mesmo filtro
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
    });

    // Buscar nomes dos produtos
    const productIds = topProducts.map((p) => p.product_id);
    const products = await db.products.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });

    const productNameById = new Map(products.map((p) => [p.id, p.name]));

    return NextResponse.json({
      totalSales,
      totalOrders,
      avgTicket,
      topProducts: topProducts.map((p) => ({
        productId: p.product_id,
        name: productNameById.get(p.product_id) ?? "Desconhecido",
        quantitySold: p._sum.quantity,
      })),
    });
  } catch (err) {
    console.error("Erro ao gerar resumo de vendas:", err);
    return NextResponse.json(
      { error: "Erro ao gerar resumo de vendas" },
      { status: 500 }
    );
  }
}
