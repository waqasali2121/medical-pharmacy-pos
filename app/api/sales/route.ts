import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const schema=z.object({items:z.array(z.object({medicineId:z.string(),batchId:z.string(),quantity:z.coerce.number().int().positive(),unitPrice:z.coerce.number().nonnegative(),costPrice:z.coerce.number().nonnegative()})).min(1),paid:z.coerce.number().nonnegative(),paymentMethod:z.enum(["CASH","CARD","BANK","MOBILE_WALLET","CREDIT"])});

export async function POST(req:Request){
 const user=await getCurrentUser(); if(!user) return NextResponse.json({error:"Unauthorized"},{status:401});
 try{
  const d=schema.parse(await req.json());
  const result=await db.$transaction(async tx=>{
   const invoiceNumber=`INV-${new Date().toISOString().slice(0,10).replaceAll("-","")}-${Math.floor(Math.random()*90000+10000)}`;
   let subtotal=0;
   for(const item of d.items){
     const batch=await tx.medicineBatch.findUnique({where:{id:item.batchId}});
     if(!batch||batch.medicineId!==item.medicineId) throw new Error("Invalid batch");
     if(batch.expiryDate<=new Date()) throw new Error("Cannot sell an expired batch");
     if(batch.quantity<item.quantity) throw new Error(`Insufficient stock for batch ${batch.batchNumber}`);
     subtotal+=item.quantity*item.unitPrice;
   }
   const total=subtotal;
   const paid=d.paymentMethod==="CREDIT"?d.paid:d.paid;
   if(d.paymentMethod!=="CREDIT"&&paid<total) throw new Error("Paid amount is less than total");
   const sale=await tx.sale.create({data:{invoiceNumber,userId:user.id,subtotal,discount:0,tax:0,total,paid,balance:Math.max(0,total-paid),paymentMethod:d.paymentMethod}});
   for(const item of d.items){
     const batch=await tx.medicineBatch.findUniqueOrThrow({where:{id:item.batchId}});
     const before=batch.quantity; const after=before-item.quantity;
     await tx.medicineBatch.update({where:{id:item.batchId},data:{quantity:after}});
     await tx.saleItem.create({data:{saleId:sale.id,medicineId:item.medicineId,batchId:item.batchId,quantity:item.quantity,unitPrice:item.unitPrice,costPrice:item.costPrice,total:item.quantity*item.unitPrice}});
     await tx.inventoryTransaction.create({data:{medicineId:item.medicineId,batchId:item.batchId,type:"SALE",quantity:-item.quantity,beforeQty:before,afterQty:after,userId:user.id,referenceId:sale.id}});
   }
   await tx.salePayment.create({data:{saleId:sale.id,method:d.paymentMethod,amount:paid}});
   await tx.auditLog.create({data:{userId:user.id,action:"CREATE_SALE",entity:"Sale",entityId:sale.id,details:invoiceNumber}});
   return sale;
  });
  return NextResponse.json({id:result.id,invoiceNumber:result.invoiceNumber});
 }catch(e:any){return NextResponse.json({error:e?.message||"Sale failed"},{status:400});}
}
