import { db } from "@/lib/db";
import { DollarSign, TrendingUp, ShoppingBag, Pill, AlertTriangle, Clock } from "lucide-react";

function money(v: any) { return `Rs. ${Number(v || 0).toLocaleString("en-PK", { minimumFractionDigits: 2 })}`; }

export default async function Dashboard() {
  const [sales, purchases, medicines, batches, lowStock] = await Promise.all([
    db.sale.aggregate({ where: { status: "COMPLETED" }, _sum: { total: true }, _count: true }),
    db.purchase.aggregate({ _sum: { total: true } }),
    db.medicine.count({ where: { active: true } }),
    db.medicineBatch.findMany({ where: { expiryDate: { lte: new Date(Date.now() + 90 * 86400000) } }, include: { medicine: true }, orderBy: { expiryDate: "asc" }, take: 8 }),
    db.medicine.findMany({ where: { active: true }, include: { batches: true }, take: 100 }),
  ]);
  const low = lowStock.filter(m => m.batches.reduce((a, b) => a + b.quantity, 0) <= m.reorderLevel).length;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todaySales = await db.sale.aggregate({ where: { createdAt: { gte: today }, status: "COMPLETED" }, _sum: { total: true }, _count: true });

  const stats = [
    { label: "Today's Sales", value: money(todaySales._sum.total), sub: `${todaySales._count} transactions`, color: "teal", icon: DollarSign },
    { label: "Total Sales", value: money(sales._sum.total), sub: `${sales._count} invoices`, color: "blue", icon: TrendingUp },
    { label: "Total Purchases", value: money(purchases._sum.total), sub: "All time", color: "violet", icon: ShoppingBag },
    { label: "Active Medicines", value: medicines.toString(), sub: "In catalogue", color: "amber", icon: Pill },
  ];

  const expiredCount = batches.filter(b => b.expiryDate < new Date()).length;

  return <div className="space-y-7">
    {/* Header */}
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
      <p className="text-slate-500 mt-1">Welcome back! Here&apos;s your pharmacy overview.</p>
    </div>

    {/* Stat Cards */}
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map(s => (
        <div key={s.label} className={`stat-card ${s.color}`}>
          <div className={`stat-icon ${s.color}`}>
            <s.icon size={22} />
          </div>
          <div className="text-sm font-medium text-slate-500">{s.label}</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{s.value}</div>
          <div className="text-xs text-slate-400 mt-1">{s.sub}</div>
        </div>
      ))}
    </div>

    {/* Main Content */}
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Expiring Batches */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock size={18} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Expiring Soon</h2>
            <p className="text-xs text-slate-500">Batches expiring within 90 days</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table text-sm">
            <thead><tr><th>Medicine</th><th>Batch</th><th>Expiry</th><th>Qty</th></tr></thead>
            <tbody>
              {batches.length === 0 && <tr><td colSpan={4} className="text-center text-slate-400 py-8">No batches expiring soon 🎉</td></tr>}
              {batches.map(b => {
                const isExpired = b.expiryDate < new Date();
                return <tr key={b.id}>
                  <td className="font-medium">{b.medicine.name}</td>
                  <td><span className="text-slate-500">{b.batchNumber}</span></td>
                  <td><span className={`badge ${isExpired ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {b.expiryDate.toISOString().slice(0, 10)}
                  </span></td>
                  <td className="font-semibold">{b.quantity}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Alerts & Notifications</h2>
            <p className="text-xs text-slate-500">Issues requiring your attention</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="alert alert-amber">
            <AlertTriangle size={18} />
            <div><b>{low}</b> medicines are at or below reorder level.</div>
          </div>
          <div className="alert alert-red">
            <Clock size={18} />
            <div><b>{expiredCount}</b> batches have expired and need attention.</div>
          </div>
          <div className="alert alert-teal">
            <ShoppingBag size={18} />
            <div>FEFO batch selection is enabled for POS sales.</div>
          </div>
          <div className="alert alert-blue">
            <TrendingUp size={18} />
            <div><b>{todaySales._count}</b> sales completed today.</div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}
