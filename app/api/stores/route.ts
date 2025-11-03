// src/app/api/stores/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const stores = await db.stores.findMany({
      where: { is_active: true }, // opcional; remova se quiser todas
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(stores);
  } catch (err) {
    console.error("Erro ao buscar lojas:", err);
    return NextResponse.json(
      { error: "Erro ao buscar lojas" },
      { status: 500 }
    );
  }
}
