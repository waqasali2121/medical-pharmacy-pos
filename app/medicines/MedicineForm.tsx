"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, AlertCircle } from "lucide-react";

export default function MedicineForm({ categories }: { categories: any[] }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [f, setF] = useState({
    productId: "",
    barcode: "",
    name: "",
    genericName: "",
    categoryId: "",
    purchasePrice: "",
    salePrice: "",
    mrp: "",
    batchNumber: "",
    expiryDate: "",
    quantity: ""
  });

  function set(k: string, v: string) {
    setF(x => ({ ...x, [k]: v }));
  }

  function resetForm() {
    setF({
      productId: "",
      barcode: "",
      name: "",
      genericName: "",
      categoryId: "",
      purchasePrice: "",
      salePrice: "",
      mrp: "",
      batchNumber: "",
      expiryDate: "",
      quantity: ""
    });
    setMsg("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const r = await fetch("/api/medicines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f)
    });

    const j = await r.json();
    setLoading(false);

    if (!r.ok) {
      setMsg(j.error || "Failed to save medicine");
      return;
    }

    setOpen(false);
    resetForm();
    router.refresh();
  }

  return (
    <div>
      {!open ? (
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          <Plus size={16} /> Add Medicine
        </button>
      ) : (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Medicine</h3>
                <p className="text-xs text-slate-500 mt-1">Fields marked with * are required.</p>
              </div>
              <button
                type="button"
                onClick={() => { setOpen(false); resetForm(); }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={save} className="p-6 space-y-6">
              {/* Mandatory Fields Section */}
              <div>
                <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-3">Required Information</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Medicine Name *</label>
                    <input
                      className="input"
                      placeholder="e.g. Paracetamol 500mg"
                      value={f.name}
                      onChange={e => set("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Opening Quantity *</label>
                    <input
                      className="input"
                      type="number"
                      min="0"
                      placeholder="e.g. 100"
                      value={f.quantity}
                      onChange={e => set("quantity", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Purchase Price (Rs.) *</label>
                    <input
                      className="input"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={f.purchasePrice}
                      onChange={e => set("purchasePrice", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Sale Price (Rs.) *</label>
                    <input
                      className="input"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={f.salePrice}
                      onChange={e => set("salePrice", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Optional Advanced Fields Section */}
              <div className="border-t border-slate-100 pt-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Optional Details (Auto-Generated if Blank)</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Category</label>
                    <select
                      className="input"
                      value={f.categoryId}
                      onChange={e => set("categoryId", e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Generic Name</label>
                    <input
                      className="input"
                      placeholder="e.g. Acetaminophen"
                      value={f.genericName}
                      onChange={e => set("genericName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Product ID</label>
                    <input
                      className="input"
                      placeholder="Auto-generated if empty"
                      value={f.productId}
                      onChange={e => set("productId", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Barcode</label>
                    <input
                      className="input"
                      placeholder="Scan or type barcode"
                      value={f.barcode}
                      onChange={e => set("barcode", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Initial Batch Number</label>
                    <input
                      className="input"
                      placeholder="Defaults to BATCH-01"
                      value={f.batchNumber}
                      onChange={e => set("batchNumber", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Expiry Date</label>
                    <input
                      className="input"
                      type="date"
                      value={f.expiryDate}
                      onChange={e => set("expiryDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">MRP (Maximum Retail Price)</label>
                    <input
                      className="input"
                      type="number"
                      step="0.01"
                      placeholder="Defaults to Sale Price"
                      value={f.mrp}
                      onChange={e => set("mrp", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {msg && (
                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl text-sm font-medium">
                  <AlertCircle size={16} />
                  <span>{msg}</span>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  className="btn"
                  onClick={() => { setOpen(false); resetForm(); }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Medicine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
