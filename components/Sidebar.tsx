import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Pill, Package, Users, Truck, Receipt, BarChart3, Settings, LogOut, Heart } from "lucide-react";
import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";

const mainLinks = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["POS / New Sale", "/pos", ShoppingCart],
];
const managementLinks = [
  ["Sales", "/sales", Receipt],
  ["Medicines", "/medicines", Pill],
  ["Inventory", "/inventory", Package],
  ["Purchases", "/purchases", ShoppingCart],
];
const otherLinks = [
  ["Customers", "/customers", Users],
  ["Suppliers", "/suppliers", Truck],
  ["Reports", "/reports", BarChart3],
];

export default function Sidebar({ role }: { role?: string }) {
  return <aside className="sidebar">
    <div className="sidebar-logo">
      <div className="sidebar-logo-icon"><Heart size={18} /></div>
      MediPOS
    </div>

    <nav className="flex-1 space-y-1">
      {mainLinks.map(([label, href, Icon]: any) => (
        <Link key={href} href={href} className="sidebar-link"><Icon size={18}/>{label}</Link>
      ))}

      <div className="sidebar-section">Management</div>
      {managementLinks.map(([label, href, Icon]: any) => (
        <Link key={href} href={href} className="sidebar-link"><Icon size={18}/>{label}</Link>
      ))}

      <div className="sidebar-section">Other</div>
      {otherLinks.map(([label, href, Icon]: any) => (
        <Link key={href} href={href} className="sidebar-link"><Icon size={18}/>{label}</Link>
      ))}

      {role === "ADMIN" && <>
        <div className="sidebar-section">System</div>
        <Link href="/settings" className="sidebar-link"><Settings size={18}/>Settings</Link>
      </>}
    </nav>

    <form action={async () => { "use server"; await logout(); redirect("/login"); }} className="mt-auto pt-4 border-t border-white/10">
      <button className="sidebar-link w-full text-left"><LogOut size={18}/>Logout</button>
    </form>
  </aside>;
}
