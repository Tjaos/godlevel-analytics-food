import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json(
        { error: "Parâmetro 'name' é obrigatório" },
        { status: 400 }
      );
    }

    const product = await db.products.findFirst({
      where: { name },
      include: {
        product_sales: {
          include: { sales: { include: { channels: true } } },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const totalSales = product.product_sales.reduce(
      (acc, ps) => acc + Number(ps.total_price || 0),
      0
    );
    const totalQuantity = product.product_sales.reduce(
      (acc, ps) => acc + (ps.quantity || 0),
      0
    );
    const avgTicket =
      totalQuantity > 0 ? totalSales / totalQuantity : totalSales;

    const salesByChannel: Record<string, number> = {};
    product.product_sales.forEach((ps) => {
      const channelName = ps.sales?.channels?.name || "Outros";
      salesByChannel[channelName] =
        (salesByChannel[channelName] || 0) + Number(ps.total_price || 0);
    });

    const channelDistribution = Object.entries(salesByChannel).map(
      ([channel, total]) => ({
        channel,
        total,
      })
    );

    return NextResponse.json({
      name: product.name,
      totalSales,
      totalQuantity,
      avgTicket: Number(avgTicket.toFixed(2)),
      channelDistribution,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao buscar detalhes do produto" },
      { status: 500 }
    );
  }
}
