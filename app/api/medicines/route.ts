import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  productId: z.string().optional(),
  barcode: z.string().optional(),
  name: z.string().min(1, "Medicine name is required"),
  genericName: z.string().optional(),
  categoryId: z.string().optional(),
  purchasePrice: z.coerce.number().nonnegative("Purchase price must be positive"),
  salePrice: z.coerce.number().nonnegative("Sale price must be positive"),
  mrp: z.coerce.number().nonnegative().optional(),
  batchNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  quantity: z.coerce.number().int().nonnegative("Quantity must be positive")
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const rawData = await req.json();
    const d = schema.parse(rawData);

    // Auto-generate defaults for non-mandatory fields
    const defaultProductId = d.productId || `MED-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
    const defaultMrp = d.mrp ?? d.salePrice;
    const defaultBatchNumber = d.batchNumber || "BATCH-01";

    // Default expiry: 2 years from now if not specified
    const defaultExpiry = d.expiryDate
      ? new Date(d.expiryDate)
      : new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000);

    const result = await db.$transaction(async (tx) => {
      const med = await tx.medicine.create({
        data: {
          productId: defaultProductId,
          barcode: d.barcode || null,
          name: d.name,
          genericName: d.genericName || null,
          categoryId: d.categoryId || null,
          defaultPurchasePrice: d.purchasePrice,
          defaultSalePrice: d.salePrice,
          mrp: defaultMrp,
        },
      });

      const batch = await tx.medicineBatch.create({
        data: {
          medicineId: med.id,
          batchNumber: defaultBatchNumber,
          expiryDate: defaultExpiry,
          purchasePrice: d.purchasePrice,
          salePrice: d.salePrice,
          mrp: defaultMrp,
          quantity: d.quantity,
        },
      });

      await tx.inventoryTransaction.create({
        data: {
          medicineId: med.id,
          batchId: batch.id,
          type: "OPENING_STOCK",
          quantity: d.quantity,
          beforeQty: 0,
          afterQty: d.quantity,
          userId: user.id,
          reason: "Opening stock",
        },
      });

      return med;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (e: any) {
    console.error("Add medicine error:", e);
    return NextResponse.json({ error: e?.message || "Invalid data" }, { status: 400 });
  }
}
