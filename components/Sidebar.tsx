import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Pill, Package, Users, Truck, Receipt, BarChart3, Settings, LogOut } from "lucide-react";
import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";

const links = [
  ["Dashboard","/dashboard",LayoutDashboard],
  ["POS / New Sale","/pos",ShoppingCart],
  ["Sales","/sales",Receipt],
  ["Medicines","/medicines",Pill],
  ["Inventory","/inventory",Package],
  ["Purchases","/purchases",ShoppingCart],
  ["Customers","/customers",Users],
  ["Suppliers","/suppliers",Truck],
  ["Reports","/reports",BarChart3],
];

export default function Sidebar({ role }: { role?: string }) {
  return <aside className="w-64 shrink-0 border-r bg-white min-h-screen p-4">
    <div className="text-xl font-black mb-6 text-teal-700">MediPOS</div>
    <nav className="space-y-1">
      {links.map(([label, href, Icon]: any) => <Link key={href} href={href} className="sidebar-link"><Icon size={18}/>{label}</Link>)}
      {role === "ADMIN" && <Link href="/settings" className="sidebar-link"><Settings size={18}/>Settings</Link>}
    </nav>
    <form action={async () => { "use server"; await logout(); redirect("/login"); }} className="mt-8">
      <button className="sidebar-link w-full text-left"><LogOut size={18}/>Logout</button>
    </form>
  </aside>;
}
