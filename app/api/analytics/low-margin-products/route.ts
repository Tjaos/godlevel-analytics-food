import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const limit = Number(searchParams.get("limit")) || 10;
    const store = searchParams.get("store");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // 🔹 Filtro dinâmico dentro da relação "sales"
    const where: Prisma.product_salesWhereInput = {
      sales: {
        ...(store ? { store_id: Number(store) } : {}),
        ...(from && to
          ? {
              created_at: {
                gte: new Date(from),
                lte: new Date(to),
              },
            }
          : {}),
      },
    };

    // 🔹 Agrupa produtos pelo total vendido
    const grouped = await db.product_sales.groupBy({
      by: ["product_id"],
      _sum: { quantity: true },
      where,
      orderBy: { _sum: { quantity: "asc" } },
      take: limit,
    });

    if (grouped.length === 0) return NextResponse.json([]);

    // 🔹 Busca nomes dos produtos
    const productIds = grouped.map((p) => p.product_id);
    const products = await db.products.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p.name]));

    // 🔹 Combina informações
    const result = grouped.map((p) => ({
      id: p.product_id,
      name: productMap.get(p.product_id) ?? "Produto desconhecido",
      totalSold: p._sum.quantity ?? 0,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("❌ Erro ao buscar produtos com menor saída:", err);
    return NextResponse.json(
      { error: "Erro ao buscar produtos com menor saída" },
      { status: 500 }
    );
  }
}
