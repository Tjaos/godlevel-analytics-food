import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const customers = await db.customers.findMany({
      include: {
        sales: { select: { created_at: true } },
      },
    });

    const churned = customers
      .map((customer) => {
        const dates = customer.sales.map((s) => new Date(s.created_at));
        if (dates.length < 3) return null;
        const last = new Date(Math.max(...dates.map((d) => d.getTime())));
        const diffDays = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays > 30
          ? { name: customer.customer_name, lastOrder: last }
          : null;
      })
      .filter(Boolean);

    return NextResponse.json(churned);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao buscar clientes" },
      { status: 500 }
    );
  }
}
