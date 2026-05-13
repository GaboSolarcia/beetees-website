import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.searchParams.get("artistId");

  const products = await prisma.product.findMany({
    where: { ...(artistId ? { artistId } : {}), isActive: true },
    orderBy: { order: "asc" },
    include: { images: { orderBy: { order: "asc" } }, artist: true },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  const product = await prisma.product.create({
    data: {
      artistId: data.artistId,
      name: data.name,
      description: data.description || null,
      price: data.price ? parseFloat(data.price) : null,
      category: data.category,
      sizes: data.sizes || null,
      order: data.order ?? 0,
    },
    include: { images: true },
  });

  return NextResponse.json(product, { status: 201 });
}
