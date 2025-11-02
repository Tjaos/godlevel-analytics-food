import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get("channel") || "iFood";
    const weekday = Number(searchParams.get("weekday") || 4); // quinta
    const startHour = Number(searchParams.get("startHour") || 18);
    const endHour = Number(searchParams.get("endHour") || 23);

    const channelObj = await db.channels.findFirst({
      where: { name: channel },
    });

    const results = await db.sales.findMany({
      where: {
        channel_id: channelObj?.id,
        created_at: {
          gte: new Date("2025-10-01"),
          lte: new Date("2025-10-29"),
        },
      },
      include: {
        product_sales: { include: { products: true } },
      },
    });

    const filtered = results.filter((s) => {
      const d = new Date(s.created_at);
      return (
        d.getDay() === weekday &&
        d.getHours() >= startHour &&
        d.getHours() <= endHour
      );
    });

    const productCount: Record<string, number> = {};
    filtered.forEach((sale) => {
      sale.product_sales.forEach((p) => {
        const name = p.products.name;
        productCount[name] = (productCount[name] || 0) + p.quantity;
      });
    });

    const topProducts = Object.entries(productCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

    return NextResponse.json(topProducts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar top products" },
      { status: 500 }
    );
  }
}
