 "use client";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function MedicineForm({categories}:{categories:any[]}){
 const [open,setOpen]=useState(false); const [msg,setMsg]=useState(""); const router=useRouter();
 const [f,setF]=useState({productId:"",barcode:"",name:"",genericName:"",categoryId:"",purchasePrice:"",salePrice:"",mrp:"",batchNumber:"",expiryDate:"",quantity:""});
 function set(k:string,v:string){setF(x=>({...x,[k]:v}))}
 async function save(e:React.FormEvent){e.preventDefault();setMsg("");const r=await fetch("/api/medicines",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});const j=await r.json();if(!r.ok){setMsg(j.error||"Failed");return;}setOpen(false);router.refresh();}
 return <div className="card p-5">{!open?<button className="btn btn-primary" onClick={()=>setOpen(true)}>+ Add Medicine</button>:
 <form onSubmit={save} className="grid md:grid-cols-3 gap-3">
 {[
 ["productId","Product ID"],["barcode","Barcode"],["name","Medicine name"],["genericName","Generic name"],["purchasePrice","Purchase price"],["salePrice","Sale price"],["mrp","MRP"],["batchNumber","Initial batch"],["expiryDate","Expiry date"],["quantity","Opening quantity"]
 ].map(([k,l])=><input key={k} className="input" placeholder={l} type={k==="expiryDate"?"date":k.includes("Price")||["quantity"].includes(k)?"number":"text"} value={(f as any)[k]} onChange={e=>set(k,e.target.value)} required={["productId","name","purchasePrice","salePrice","mrp","batchNumber","expiryDate","quantity"].includes(k)}/> )}
 <select className="input" value={f.categoryId} onChange={e=>set("categoryId",e.target.value)}><option value="">Category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
 <div className="md:col-span-3 flex gap-2"><button className="btn btn-primary">Save</button><button type="button" className="btn" onClick={()=>setOpen(false)}>Cancel</button>{msg&&<span className="text-red-600">{msg}</span>}</div>
 </form>}</div>
}
