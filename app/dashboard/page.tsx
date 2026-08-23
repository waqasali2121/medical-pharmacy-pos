import { db } from "@/lib/db";

function money(v:any){return `Rs. ${Number(v||0).toLocaleString("en-PK",{minimumFractionDigits:2})}`;}

export default async function Dashboard(){
  const [sales,purchases,medicines,batches,lowStock] = await Promise.all([
    db.sale.aggregate({where:{status:"COMPLETED"},_sum:{total:true},_count:true}),
    db.purchase.aggregate({_sum:{total:true}}),
    db.medicine.count({where:{active:true}}),
    db.medicineBatch.findMany({where:{expiryDate:{lte:new Date(Date.now()+90*86400000)}},include:{medicine:true},orderBy:{expiryDate:"asc"},take:8}),
    db.medicine.findMany({where:{active:true},include:{batches:true},take:100})
  ]);
  const low=lowStock.filter(m=>m.batches.reduce((a,b)=>a+b.quantity,0)<=m.reorderLevel).length;
  const today=new Date(); today.setHours(0,0,0,0);
  const todaySales=await db.sale.aggregate({where:{createdAt:{gte:today},status:"COMPLETED"},_sum:{total:true}});
  return <div className="space-y-6">
    <div><h1 className="text-2xl font-black">Dashboard</h1><p className="text-gray-500">Pharmacy overview</p></div>
    <div className="grid md:grid-cols-4 gap-4">
      {[
        ["Today's Sales",money(todaySales._sum.total),"text-teal-700"],
        ["Total Sales",money(sales._sum.total),"text-blue-700"],
        ["Purchases",money(purchases._sum.total),"text-violet-700"],
        ["Medicines",medicines,"text-orange-700"]
      ].map(([a,b,c])=><div className="card p-5" key={a}><div className="text-sm text-gray-500">{a}</div><div className={`text-2xl font-black mt-2 ${c}`}>{b}</div></div>)}
    </div>
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card p-5"><h2 className="font-bold mb-4">Expiring within 90 days</h2>
        <table className="table text-sm"><thead><tr><th>Medicine</th><th>Batch</th><th>Expiry</th><th>Qty</th></tr></thead><tbody>
        {batches.map(b=><tr key={b.id}><td>{b.medicine.name}</td><td>{b.batchNumber}</td><td>{b.expiryDate.toISOString().slice(0,10)}</td><td>{b.quantity}</td></tr>)}
        </tbody></table>
      </div>
      <div className="card p-5"><h2 className="font-bold mb-4">Alerts</h2>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-amber-50 text-amber-800"><b>{low}</b> medicines are at or below reorder level.</div>
          <div className="p-3 rounded-lg bg-red-50 text-red-800"><b>{batches.filter(b=>b.expiryDate<new Date()).length}</b> batches are expired.</div>
          <div className="p-3 rounded-lg bg-teal-50 text-teal-800">FEFO batch selection is enabled for POS sales.</div>
        </div>
      </div>
    </div>
  </div>
}
