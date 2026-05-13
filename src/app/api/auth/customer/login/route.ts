import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createCustomerToken } from "@/lib/customerAuth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Correo y contraseña requeridos" }, { status: 400 });
  }

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const valid = await verifyPassword(password, customer.password);
  if (!valid) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const token = await createCustomerToken({ id: customer.id, email: customer.email, name: customer.name });

  const res = NextResponse.json({
    success: true,
    customer: { id: customer.id, email: customer.email, name: customer.name },
  });
  res.cookies.set("beetees_customer_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
