import { db } from "@/lib/db";
import MedicineForm from "./MedicineForm";
import { Search, Pill, Package, AlertCircle } from "lucide-react";

export default async function Medicines() {
  const [meds, cats] = await Promise.all([
    db.medicine.findMany({ include: { category: true, batches: true }, orderBy: { name: "asc" } }),
    db.category.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Medicines</h1>
          <p className="text-slate-500 mt-1">Manage products, pricing, categories and inventory levels.</p>
        </div>
        <MedicineForm categories={cats} />
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <Pill size={18} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Products</div>
            <div className="text-lg font-bold text-slate-950">{meds.length}</div>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <Package size={18} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Stock</div>
            <div className="text-lg font-bold text-slate-950">
              {meds.reduce((sum, m) => sum + m.batches.reduce((a, b) => a + b.quantity, 0), 0)}
            </div>
          </div>
        </div>
        <div className="card p-4 col-span-2 sm:col-span-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle size={18} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Low Stock Alerts</div>
            <div className="text-lg font-bold text-slate-950">
              {meds.filter(m => m.batches.reduce((a, b) => a + b.quantity, 0) <= m.reorderLevel).length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Product ID</th>
                <th>Barcode</th>
                <th>Category</th>
                <th>Stock Level</th>
                <th>Sale Price</th>
                <th>Earliest Expiry</th>
              </tr>
            </thead>
            <tbody>
              {meds.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-slate-400 py-12">
                    No medicines found. Click &quot;Add Medicine&quot; to get started!
                  </td>
                </tr>
              )}
              {meds.map(m => {
                const stock = m.batches.reduce((a, b) => a + b.quantity, 0);
                const sortedBatches = [...m.batches].sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());
                const exp = sortedBatches[0];
                const isLow = stock <= m.reorderLevel;

                return (
                  <tr key={m.id}>
                    <td>
                      <div>
                        <div className="font-bold text-slate-900">{m.name}</div>
                        {m.genericName && <div className="text-xs text-slate-500 mt-0.5">{m.genericName}</div>}
                      </div>
                    </td>
                    <td><span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{m.productId}</span></td>
                    <td><span className="text-slate-600 text-sm">{m.barcode || "-"}</span></td>
                    <td>
                      {m.category ? (
                        <span className="badge bg-slate-100 text-slate-700">{m.category.name}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${isLow ? "bg-rose-50 text-rose-700 border border-rose-100" : "bg-teal-50 text-teal-700 border border-teal-100"}`}>
                        {stock} units {isLow && "(Low)"}
                      </span>
                    </td>
                    <td className="font-bold text-slate-900">Rs. {Number(m.defaultSalePrice).toFixed(2)}</td>
                    <td>
                      {exp ? (
                        <span className={`badge ${exp.expiryDate < new Date() ? "bg-rose-100 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
                          {exp.expiryDate.toISOString().slice(0, 10)}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
