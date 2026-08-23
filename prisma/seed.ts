import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { username: "admin" }, update: {},
    create: { username: "admin", name: "System Administrator", passwordHash, role: "ADMIN" },
  });
  const managerHash = await bcrypt.hash("Manager@123", 12);
  await prisma.user.upsert({
    where: { username: "manager" }, update: {},
    create: { username: "manager", name: "Pharmacy Manager", passwordHash: managerHash, role: "MANAGER" },
  });
  const cashierHash = await bcrypt.hash("Cashier@123", 12);
  await prisma.user.upsert({
    where: { username: "cashier" }, update: {},
    create: { username: "cashier", name: "Front Counter", passwordHash: cashierHash, role: "CASHIER" },
  });

  const tablet = await prisma.category.upsert({ where: { name: "Tablets" }, update: {}, create: { name: "Tablets" } });
  const capsule = await prisma.category.upsert({ where: { name: "Capsules" }, update: {}, create: { name: "Capsules" } });
  const syrup = await prisma.category.upsert({ where: { name: "Syrups" }, update: {}, create: { name: "Syrups" } });

  const supplier = await prisma.supplier.upsert({
    where: { id: "demo-supplier" }, update: {},
    create: { id: "demo-supplier", companyName: "Demo Medical Distributors", phone: "0300-0000000" }
  });

  const meds = [
    { productId: "MED-0001", barcode: "890100000001", name: "Paracetamol 500mg", genericName: "Paracetamol", brandName: "Demo Pharma", dosageForm: "Tablet", strength: "500mg", defaultSalePrice: 100, defaultPurchasePrice: 80, mrp: 110, categoryId: tablet.id, reorderLevel: 20 },
    { productId: "MED-0002", barcode: "890100000002", name: "Amoxicillin 500mg", genericName: "Amoxicillin", brandName: "Demo Pharma", dosageForm: "Capsule", strength: "500mg", defaultSalePrice: 250, defaultPurchasePrice: 210, mrp: 270, categoryId: capsule.id, reorderLevel: 15 },
    { productId: "MED-0003", barcode: "890100000003", name: "Cough Relief Syrup", genericName: "Dextromethorphan", brandName: "Demo Pharma", dosageForm: "Syrup", strength: "100ml", defaultSalePrice: 180, defaultPurchasePrice: 150, mrp: 200, categoryId: syrup.id, reorderLevel: 10 }
  ];

  for (const m of meds) {
    const med = await prisma.medicine.upsert({ where: { productId: m.productId }, update: {}, create: m });
    await prisma.medicineBatch.upsert({
      where: { medicineId_batchNumber: { medicineId: med.id, batchNumber: "DEMO-001" } },
      update: {},
      create: {
        medicineId: med.id, batchNumber: "DEMO-001", expiryDate: new Date("2027-12-31"),
        purchasePrice: m.defaultPurchasePrice, salePrice: m.defaultSalePrice, mrp: m.mrp,
        quantity: 100, supplierId: supplier.id
      }
    });
  }

  await prisma.setting.upsert({ where: { key: "pharmacyName" }, update: {}, create: { key: "pharmacyName", value: "My Medical Store" } });
  await prisma.setting.upsert({ where: { key: "currency" }, update: {}, create: { key: "currency", value: "PKR" } });

  console.log("Seed completed. Admin:", admin.username);
}

main().catch(console.error).finally(() => prisma.$disconnect());
