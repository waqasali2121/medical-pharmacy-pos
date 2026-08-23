import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "./Sidebar";

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <div className="min-h-screen flex">
    <Sidebar role={user.role}/>
    <main className="flex-1 min-w-0">
      <header className="h-16 bg-white border-b flex items-center justify-between px-6">
        <div className="font-semibold">{user.name}</div>
        <div className="text-sm text-gray-500">{user.role}</div>
      </header>
      <div className="p-6">{children}</div>
    </main>
  </div>;
}
