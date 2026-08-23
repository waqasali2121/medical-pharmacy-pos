import { db } from "@/lib/db";
import POSClient from "./POSClient";
export default async function POS(){const meds=await db.medicine.findMany({where:{active:true},include:{batches:{where:{quantity:{gt:0},expiryDate:{gt:new Date()}},orderBy:{expiryDate:"asc"}}},orderBy:{name:"asc"}});return <POSClient medicines={meds.map(m=>({...m,defaultSalePrice:Number(m.defaultSalePrice),batches:m.batches.map(b=>({...b,purchasePrice:Number(b.purchasePrice),salePrice:Number(b.salePrice),mrp:Number(b.mrp)}))}))}/>;}
