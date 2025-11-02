import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 20; // limite padrão menor para visualização

    // Busca produtos com vendas (somente IDs e nome)
    const products = await db.products.findMany({
      where: {
        product_sales: { some: {} },
      },
      select: {
        id: true,
        name: true,
        product_sales: {
          select: {
            base_price: true,
            total_price: true,
            quantity: true,
          },
        },
      },
    });

    // Calcula margens
    const withMargin = products.map((product) => {
      const sales = product.product_sales;

      if (sales.length === 0)
        return { id: product.id, name: product.name, margin: 0 };

      // preços médios seguros
      const avgBasePrice =
        sales.reduce((acc, s) => acc + (s.base_price || 0), 0) / sales.length ||
        0;

      const avgSellPrice =
        sales.reduce(
          (acc, s) => acc + (s.total_price || 0) / Math.max(s.quantity || 1, 1),
          0
        ) / sales.length || 0;

      const margin =
        avgSellPrice > 0
          ? ((avgSellPrice - avgBasePrice) / avgSellPrice) * 100
          : 0;

      return {
        id: product.id,
        name: product.name,
        margin: parseFloat(margin.toFixed(2)),
      };
    });

    // Ordena por margem e aplica limite final
    const lowMargin = withMargin
      .filter((p) => !isNaN(p.margin) && p.margin < 20)
      .sort((a, b) => a.margin - b.margin)
      .slice(0, limit);

    console.log(`✅ ${lowMargin.length} produtos com baixa margem encontrados`);

    return NextResponse.json(lowMargin);
  } catch (err) {
    console.error("❌ Erro ao calcular margens:", err);
    return NextResponse.json(
      { error: "Erro ao calcular margens" },
      { status: 500 }
    );
  }
}
