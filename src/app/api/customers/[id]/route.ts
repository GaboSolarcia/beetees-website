import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCustomerSession } from "@/lib/customerAuth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (session.id !== id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, phone, address } = await req.json();

  const customer = await prisma.customer.update({
    where: { id },
    data: { name, phone: phone || null, address: address || null },
    select: { id: true, name: true, email: true, phone: true, address: true },
  });

  return NextResponse.json(customer);
}
