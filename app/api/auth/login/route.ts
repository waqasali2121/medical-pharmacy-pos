import { NextResponse } from "next/server";
import { z } from "zod";
import { login } from "@/lib/auth";

const schema=z.object({username:z.string().min(1),password:z.string().min(1)});
export async function POST(req:Request){
  try {
    const data=schema.parse(await req.json());
    const user=await login(data.username,data.password);
    if(!user) return NextResponse.json({error:"Invalid credentials"},{status:401});
    return NextResponse.json({id:user.id,name:user.name,role:user.role});
  } catch { return NextResponse.json({error:"Invalid request"},{status:400}); }
}
