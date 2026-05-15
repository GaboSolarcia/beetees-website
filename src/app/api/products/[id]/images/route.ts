import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { url, isPrimary, order, colorLabel } = await req.json();

  if (isPrimary) {
    await prisma.productImage.updateMany({
      where: { productId: id },
      data: { isPrimary: false },
    });
  }

  const image = await prisma.productImage.create({
    data: { productId: id, url, isPrimary: isPrimary ?? false, order: order ?? 0, colorLabel: colorLabel || null },
  });

  return NextResponse.json(image, { status: 201 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await params;
  const { imageId, colorLabel } = await req.json();
  if (!imageId) return NextResponse.json({ error: "imageId required" }, { status: 400 });

  const image = await prisma.productImage.update({
    where: { id: imageId },
    data: { colorLabel: colorLabel || null },
  });

  return NextResponse.json(image);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await params;
  const imageId = req.nextUrl.searchParams.get("imageId");
  if (!imageId) return NextResponse.json({ error: "imageId required" }, { status: 400 });

  await prisma.productImage.delete({ where: { id: imageId } });
  return NextResponse.json({ success: true });
}
