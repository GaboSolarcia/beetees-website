import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  const count = await prisma.order.count();
  const orderNumber = String(count + 1).padStart(4, "0");

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId: data.customerId || null,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone || null,
      total: data.total,
      paymentMethod: data.paymentMethod,
      deliveryType: data.deliveryType ?? "pickup",
      deliveryAddress: data.deliveryAddress || null,
      status: "pending",
      items: {
        create: data.items.map((item: {
          productId: string;
          name: string;
          artistName: string;
          price: number;
          quantity: number;
          size: string | null;
        }) => ({
          productId: item.productId,
          name: item.name,
          artistName: item.artistName,
          price: item.price,
          quantity: item.quantity,
          size: item.size ?? null,
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json(order, { status: 201 });
}
