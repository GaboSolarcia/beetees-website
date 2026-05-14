import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createCustomerToken } from "@/lib/customerAuth";

export async function POST(req: NextRequest) {
  const { name, email, password, phone } = await req.json();

  if (!name || !email || !password || !phone) {
    return NextResponse.json({ error: "Nombre, correo, teléfono y contraseña son requeridos" }, { status: 400 });
  }

  const existingEmail = await prisma.customer.findUnique({ where: { email } });
  if (existingEmail) {
    return NextResponse.json({ error: "Ya existe una cuenta con ese correo" }, { status: 409 });
  }

  const existingPhone = await prisma.customer.findUnique({ where: { phone } });
  if (existingPhone) {
    return NextResponse.json({ error: "Ya existe una cuenta con ese número de teléfono" }, { status: 409 });
  }

  const hashed = await hashPassword(password);
  const customer = await prisma.customer.create({
    data: { name, email, password: hashed, phone },
  });

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
