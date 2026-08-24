"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Key } from "lucide-react";

export default function LoginForm() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (r.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid username or password.");
    }
    setLoading(false);
  }

  return <form onSubmit={submit} className="space-y-5">
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <User size={18} />
        </div>
        <input className="input pl-10" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
      </div>
    </div>
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Lock size={18} />
        </div>
        <input type="password" className="input pl-10" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
      </div>
    </div>
    {error && <div className="text-rose-600 text-xs font-semibold bg-rose-50 p-2.5 rounded-lg border border-rose-100">{error}</div>}
    <button className="btn btn-primary w-full py-3" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
    <div className="border-t border-slate-100 pt-4 text-center">
      <span className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <Key size={12} /> Demo: admin / Admin@123
      </span>
    </div>
  </form>;
}
