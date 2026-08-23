import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const schema=z.object({
 productId:z.string().min(1),barcode:z.string().optional(),name:z.string().min(1),genericName:z.string().optional(),categoryId:z.string().optional(),
 purchasePrice:z.coerce.number().nonnegative(),salePrice:z.coerce.number().nonnegative(),mrp:z.coerce.number().nonnegative(),
 batchNumber:z.string().min(1),expiryDate:z.string(),quantity:z.coerce.number().int().nonnegative()
});
export async function POST(req:Request){
 const user=await getCurrentUser(); if(!user||!["ADMIN","MANAGER"].includes(user.role)) return NextResponse.json({error:"Forbidden"},{status:403});
 try{
  const d=schema.parse(await req.json());
  const result=await db.$transaction(async tx=>{
    const med=await tx.medicine.create({data:{productId:d.productId,barcode:d.barcode||null,name:d.name,genericName:d.genericName||null,categoryId:d.categoryId||null,defaultPurchasePrice:d.purchasePrice,defaultSalePrice:d.salePrice,mrp:d.mrp}});
    const batch=await tx.medicineBatch.create({data:{medicineId:med.id,batchNumber:d.batchNumber,expiryDate:new Date(d.expiryDate),purchasePrice:d.purchasePrice,salePrice:d.salePrice,mrp:d.mrp,quantity:d.quantity}});
    await tx.inventoryTransaction.create({data:{medicineId:med.id,batchId:batch.id,type:"OPENING_STOCK",quantity:d.quantity,beforeQty:0,afterQty:d.quantity,userId:user.id,reason:"Opening stock"}});
    return med;
  });
  return NextResponse.json(result,{status:201});
 }catch(e:any){return NextResponse.json({error:e?.message||"Invalid data"},{status:400});}
}
