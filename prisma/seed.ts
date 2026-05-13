import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");
const libsql = createClient({ url: `file:${dbPath}` });
const adapter = new PrismaLibSQL(libsql);
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
