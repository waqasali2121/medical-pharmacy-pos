import {getCurrentUser} from "@/lib/auth";
import {redirect} from "next/navigation";
export default async function Settings(){const u=await getCurrentUser();if(!u||u.role!=="ADMIN")redirect("/dashboard");return <div className="space-y-4"><h1 className="text-2xl font-black">Settings</h1><div className="card p-5"><p>Admin settings foundation is ready. Configure pharmacy name, currency, receipt options, expiry warning and permissions here as the next module.</p></div></div>}
