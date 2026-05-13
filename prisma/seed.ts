import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: "admin@beetees.cr" } });
  if (existing) {
    console.log("Admin user already exists.");
    return;
  }

  const password = await bcrypt.hash("beetees2025", 12);
  await prisma.user.create({
    data: {
      email: "admin@beetees.cr",
      password,
      name: "Admin Beetees",
      role: "admin",
    },
  });

  console.log("✅ Admin user created:");
  console.log("   Email: admin@beetees.cr");
  console.log("   Password: beetees2025");
  console.log("   ⚠️  Change the password after first login!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
