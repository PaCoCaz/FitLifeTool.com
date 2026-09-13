"use client";
import { FormEvent,useRef,useState } from "react";
import Card from "@/components/ui/Card"; import CardHeader from "@/components/ui/CardHeader";
import { EMAIL_CHANGE_MAX_LENGTH,isValidEmailChange } from "@/lib/auth/emailChange";
import { createEmailChangeSubmissionGate,parseEmailChangeResponse,parseLocalCleanup } from "@/lib/auth/emailChangeClient";
import { notifyClientSessionEvent } from "@/lib/auth/clientSessionLifecycle";
import { getLocalizedPublicHome } from "@/lib/auth/sessionLifecycle";
import { uiText } from "@/lib/uiText"; import type { Lang } from "@/lib/useLang";
export default function EmailChangeCard({language,canonicalEmail,available}:{language:Lang;canonicalEmail:string|null;available:boolean}){
  const t=uiText[language].auth,gate=useRef(createEmailChangeSubmissionGate());
  const passwordRef=useRef<HTMLInputElement>(null),emailRef=useRef<HTMLInputElement>(null);
  const [password,setPassword]=useState(""),[email,setEmail]=useState(""),[busy,setBusy]=useState(false);
  const [terminal,setTerminal]=useState<null|"cleanup"|"navigation"|"pending"|"unknown">(null),[error,setError]=useState<string|null>(null);
  async function cleanup(){
    try{
      const result=await fetch("/auth/logout",{method:"POST",credentials:"include",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({language})});
      const body:unknown=await result.json(),destination=parseLocalCleanup(result.status,body,language);
      if(!destination){setTerminal("cleanup");return;}
      notifyClientSessionEvent("logout");
      try{window.location.assign(destination);}catch{setTerminal("navigation");}
    }catch{setTerminal("cleanup");}
  }
  async function submit(event:FormEvent){event.preventDefault();setError(null);
    if(!password){setError(t.emailChangeCurrentPasswordRequired);passwordRef.current?.focus();return;}
    if(!isValidEmailChange(email)){setError(t.emailChangeInvalid);emailRef.current?.focus();return;}
    if(canonicalEmail?.trim().toLowerCase()===email.trim().toLowerCase()){setError(t.emailChangeUnchanged);emailRef.current?.focus();return;}
    if(!gate.current.begin())return;setBusy(true);
    try{
      const result=await fetch("/api/auth/change-email",{method:"POST",credentials:"include",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword:password,newEmail:email,language})});
      const body:unknown=await result.json(),code=parseEmailChangeResponse(result.status,body);
      if(code==="EMAIL_CHANGE_REQUEST_ACCEPTED"||code==="EMAIL_CHANGE_REQUEST_ACCEPTED_CLEANUP_REQUIRED"){
        gate.current.lock();setPassword("");setEmail("");setTerminal("pending");await cleanup();return;
      }
      if(code==="EMAIL_CHANGE_STATUS_UNKNOWN"){gate.current.lock();setPassword("");setEmail("");setTerminal("unknown");return;}
      setError(t.emailChangeUnavailable);
    }catch{gate.current.lock();setPassword("");setEmail("");setTerminal("unknown");}
    finally{gate.current.finish();setBusy(false);}
  }
  return <Card header={<CardHeader title={t.emailChangeTitle}/>}>
    <div className="space-y-4 pt-3">{!available||!canonicalEmail?
      <p role="alert" className="text-sm text-amber-800">{t.emailChangeUnavailable}</p>:terminal?
      <div className="space-y-3"><p role="status" className="text-sm text-amber-800">{terminal==="navigation"?t.emailChangeNavigationRequired:terminal==="unknown"?t.emailChangeUnknown:t.emailChangePending}</p>
        {(terminal==="cleanup"||terminal==="pending")&&<button type="button" onClick={()=>void cleanup()} className="rounded border px-4 py-2">{t.emailChangeRetryCleanup}</button>}
        {terminal==="navigation"&&<a href={getLocalizedPublicHome(language)} className="text-[#191970] underline">{t.emailChangeContinueHome}</a>}</div>:
      <form onSubmit={submit} noValidate className="space-y-4">
        <p className="text-sm text-gray-600">{t.emailChangeDescription}</p><p className="text-sm"><strong>{t.emailChangeCurrent}:</strong> {canonicalEmail}</p>
        <label htmlFor="email-change-password" className="block text-xs font-semibold">{t.emailChangeCurrentPassword}</label>
        <input ref={passwordRef} id="email-change-password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} disabled={busy} aria-invalid={error===t.emailChangeCurrentPasswordRequired} aria-describedby={error?"email-change-error":undefined} className="w-full rounded border px-3 py-2"/>
        <label htmlFor="email-change-new" className="block text-xs font-semibold">{t.emailChangeNew}</label>
        <input ref={emailRef} id="email-change-new" type="email" autoComplete="email" maxLength={EMAIL_CHANGE_MAX_LENGTH} value={email} onChange={e=>setEmail(e.target.value)} disabled={busy} aria-invalid={!!error&&error!==t.emailChangeCurrentPasswordRequired} aria-describedby={error?"email-change-error":undefined} className="w-full rounded border px-3 py-2"/>
        {error&&<p id="email-change-error" role="alert" className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={busy} className="rounded border px-4 py-2">{busy?t.emailChangeSubmitting:t.emailChangeSubmit}</button>
      </form>}</div></Card>;
}
