import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // 🔹 Parâmetros opcionais
    const channelName = searchParams.get("channel");
    const weekdayParam = searchParams.get("weekday");
    const startHourParam = searchParams.get("startHour");
    const endHourParam = searchParams.get("endHour");

    const weekday = weekdayParam ? Number(weekdayParam) : null;
    const startHour = startHourParam ? Number(startHourParam) : null;
    const endHour = endHourParam ? Number(endHourParam) : null;

    // 🔹 Período base fixo (mês de outubro)
    const from = new Date("2025-10-01");
    const to = new Date("2025-10-31");

    // 🔹 Busca canal, se especificado
    let channelId: number | undefined = undefined;
    if (channelName) {
      const channel = await db.channels.findFirst({
        where: { name: { equals: channelName, mode: "insensitive" } },
        select: { id: true },
      });
      if (channel) channelId = channel.id;
    }

    // 🔹 Busca vendas com produtos
    const sales = await db.sales.findMany({
      where: {
        ...(channelId && { channel_id: channelId }),
        created_at: { gte: from, lte: to },
      },
      select: {
        created_at: true,
        product_sales: {
          select: {
            quantity: true,
            products: { select: { id: true, name: true } },
          },
        },
      },
    });

    // 🔹 Agrupamento em memória com filtros
    const grouped: Record<string, { total: number; count: number }> = {};

    sales.forEach((sale) => {
      const date = new Date(sale.created_at);
      const hour = date.getHours();
      const day = date.getDay();

      // Filtros
      if (weekday !== null && day !== weekday) return;
      if (
        startHour !== null &&
        endHour !== null &&
        (hour < startHour || hour > endHour)
      )
        return;

      sale.product_sales.forEach((ps) => {
        const productName = ps.products.name;
        if (!grouped[productName])
          grouped[productName] = { total: 0, count: 0 };
        grouped[productName].total += ps.quantity;
        grouped[productName].count += 1;
      });
    });

    // 🔹 Se não tiver horário → média diária
    const products = Object.entries(grouped).map(
      ([name, { total, count }]) => ({
        name,
        totalSold:
          startHour === null && endHour === null
            ? Number((total / count).toFixed(2)) // média
            : total, // total vendido no horário
      })
    );

    // 🔹 Ordena do mais vendido pro menos
    const ordered = products.sort((a, b) => b.totalSold - a.totalSold);

    return NextResponse.json(ordered);
  } catch (error) {
    console.error("❌ Erro em /api/analytics/top-products:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos mais vendidos" },
      { status: 500 }
    );
  }
}
