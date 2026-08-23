 "use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username,setUsername]=useState("admin");
  const [password,setPassword]=useState("Admin@123");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const router=useRouter();

  async function submit(e:React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});
    if(r.ok) router.push("/dashboard"); else setError("Invalid username or password.");
    setLoading(false);
  }
  return <form onSubmit={submit} className="space-y-4">
    <div><label className="block text-sm font-semibold mb-1">Username</label><input className="input" value={username} onChange={e=>setUsername(e.target.value)}/></div>
    <div><label className="block text-sm font-semibold mb-1">Password</label><input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)}/></div>
    {error && <div className="text-red-600 text-sm">{error}</div>}
    <button className="btn btn-primary w-full" disabled={loading}>{loading?"Signing in...":"Sign in"}</button>
    <div className="text-xs text-gray-500 text-center">Demo: admin / Admin@123</div>
  </form>;
}
