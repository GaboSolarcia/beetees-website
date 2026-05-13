import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const events = await prisma.event.findMany({
    where: { isActive: true },
    orderBy: [{ date: "asc" }, { order: "asc" }],
    include: {
      artist: {
        include: {
          products: {
            where: { isActive: true },
            orderBy: { order: "asc" },
            include: { images: { orderBy: { order: "asc" } } },
          },
        },
      },
    },
  });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  const event = await prisma.event.create({
    data: {
      name: data.name,
      date: new Date(data.date),
      venue: data.venue,
      location: data.location || null,
      description: data.description || null,
      posterImage: data.posterImage || null,
      artistId: data.artistId,
      isActive: data.isActive ?? true,
      order: data.order ?? 0,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
