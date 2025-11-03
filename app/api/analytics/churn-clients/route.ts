import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const minDays = 30;

    // Busca clientes com suas vendas e o nome da loja
    const customers = await db.customers.findMany({
      include: {
        sales: {
          select: {
            created_at: true,
            stores: {
              select: { name: true },
            },
          },
          where: {
            sale_status_desc: { notIn: ["Cancelado", "Estornado"] },
          },
        },
      },
    });

    const churned = customers
      .map((customer) => {
        const sales = customer.sales;
        if (sales.length === 0) return null;

        // Encontra a última venda
        const lastSale = sales.reduce((latest, s) =>
          !latest || new Date(s.created_at) > new Date(latest.created_at)
            ? s
            : latest
        );

        const lastOrderDate = new Date(lastSale.created_at);
        const diffDays =
          (Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays <= minDays) return null;

        return {
          name: customer.customer_name ?? "Cliente sem nome",
          lastOrder: lastOrderDate,
          lastStore: lastSale.stores?.name ?? "Loja desconhecida",
          daysInactive: Math.floor(diffDays),
        };
      })
      .filter(Boolean)
      .sort((a, b) => b!.daysInactive - a!.daysInactive);

    return NextResponse.json(churned);
  } catch (err) {
    console.error("❌ Erro ao buscar clientes inativos:", err);
    return NextResponse.json(
      { error: "Erro ao buscar clientes inativos" },
      { status: 500 }
    );
  }
}
