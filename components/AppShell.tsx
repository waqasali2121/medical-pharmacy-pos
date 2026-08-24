import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "./Sidebar";

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const initials = user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  return <div className="min-h-screen flex">
    <Sidebar role={user.role}/>
    <main className="flex-1 min-w-0 flex flex-col">
      <header className="app-header">
        <div>
          <div className="text-sm font-semibold text-slate-800">{user.name}</div>
          <div className="text-xs text-slate-500">{user.role}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-500">Logged in as</div>
            <div className="text-sm font-semibold text-slate-700">{user.role}</div>
          </div>
          <div className="user-avatar">{initials}</div>
        </div>
      </header>
      <div className="flex-1 p-7 page-content">{children}</div>
    </main>
  </div>;
}
