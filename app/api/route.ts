import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const brands = await db.brands.findMany();
    return NextResponse.json(brands);
  } catch (error) {
    console.error("Erro DB:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados" },
      { status: 500 }
    );
  }
}
