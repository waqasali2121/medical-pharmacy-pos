import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./app/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: "postgresql://neondb_owner:npg_IxtsvuB16TzS@ep-morning-heart-ay8pyqg0.c-5.us-east-2.aws.neon.tech/pharmacy?sslmode=require" });
const db = new PrismaClient({ adapter });

try {
  const users = await db.user.findMany();
  console.log("Found users:", users.length);
  users.forEach(u => console.log(u.username, u.role, u.active));
} catch(e) {
  console.error("Error:", e.message);
} finally {
  await db.$disconnect();
}
