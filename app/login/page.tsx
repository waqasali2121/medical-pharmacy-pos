import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { Heart } from "lucide-react";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return <div className="login-bg">
    <div className="login-card">
      <div className="text-center mb-8">
        <div className="inline-flex w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 items-center justify-center mb-4">
          <Heart size={24} className="fill-teal-500/10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">MediPOS</h1>
        <p className="text-slate-500 mt-2 text-sm">Medical Store & Pharmacy POS</p>
      </div>
      <LoginForm />
    </div>
  </div>;
}
