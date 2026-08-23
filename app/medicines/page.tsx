import { db } from "@/lib/db";
import MedicineForm from "./MedicineForm";

export default async function Medicines(){
 const [meds,cats]=await Promise.all([db.medicine.findMany({include:{category:true,batches:true},orderBy:{name:"asc"}}),db.category.findMany({orderBy:{name:"asc"}})]);
 return <div className="space-y-6"><div><h1 className="text-2xl font-black">Medicines</h1><p className="text-gray-500">Products, pricing, batches and reorder levels</p></div>
 <MedicineForm categories={cats}/>
 <div className="card p-5 overflow-x-auto"><table className="table text-sm"><thead><tr><th>Product</th><th>Barcode</th><th>Category</th><th>Stock</th><th>Sale</th><th>Expiry</th></tr></thead><tbody>
 {meds.map(m=>{const stock=m.batches.reduce((a,b)=>a+b.quantity,0);const exp=m.batches.sort((a,b)=>a.expiryDate.getTime()-b.expiryDate.getTime())[0];return <tr key={m.id}><td><b>{m.name}</b><div className="text-xs text-gray-500">{m.genericName||""}</div></td><td>{m.barcode||"-"}</td><td>{m.category?.name||"-"}</td><td><span className={`badge ${stock<=m.reorderLevel?"bg-red-100 text-red-700":"bg-green-100 text-green-700"}`}>{stock}</span></td><td>Rs. {Number(m.defaultSalePrice).toFixed(2)}</td><td>{exp?exp.expiryDate.toISOString().slice(0,10):"-"}</td></tr>})}
 </tbody></table></div></div>
}
