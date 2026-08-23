import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return <div className="min-h-screen grid place-items-center p-6 bg-slate-100">
    <div className="card w-full max-w-md p-8">
      <div className="text-center mb-7">
        <div className="text-3xl font-black text-teal-700">MediPOS</div>
        <p className="text-gray-500 mt-2">Medical Store & Pharmacy POS</p>
      </div>
      <LoginForm />
    </div>
  </div>;
}
