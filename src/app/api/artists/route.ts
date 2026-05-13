import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const artists = await prisma.artist.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: {
      products: {
        where: { isActive: true },
        include: { images: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      },
    },
  });
  return NextResponse.json(artists);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const artist = await prisma.artist.create({
    data: {
      name: data.name,
      slug,
      description: data.description || null,
      coverImage: data.coverImage || null,
      order: data.order ?? 0,
    },
  });

  return NextResponse.json(artist, { status: 201 });
}
