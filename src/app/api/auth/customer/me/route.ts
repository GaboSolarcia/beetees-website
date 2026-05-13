import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCustomerSession } from "@/lib/customerAuth";

export async function GET() {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json(null);

  const customer = await prisma.customer.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, phone: true, address: true },
  });
  return NextResponse.json(customer);
}
