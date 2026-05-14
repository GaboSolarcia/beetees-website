import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await prisma.user.count();
    return NextResponse.json({ status: "ok", db: "connected" });
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: String(err) },
      { status: 500 }
    );
  }
}
