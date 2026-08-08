import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const rawUrl = process.env.DATABASE_URL;
const databaseUrl = rawUrl ? `${rawUrl.split("?")[0]}?sslmode=require` : rawUrl;
const adapter = new PrismaPg({ connectionString: databaseUrl! });

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
export { prisma as db }
