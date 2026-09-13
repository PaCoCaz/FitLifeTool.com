import { createClient } from "@/lib/supabaseServer";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import { buildEmailChangeRedirect, createDefaultEmailChangeFreshClient, createEmailChangeAction, EMAIL_CHANGE_MAX_BODY_BYTES, EMAIL_CHANGE_RESPONSE_HEADERS, getEmailChangeRequestTransition, isValidEmailChange, parseEmailChangeBody, resolveEmailChangeIdentity, type EmailChangeCode, type EmailChangeFreshClient, type EmailChangeNormalClient } from "@/lib/auth/emailChange";
import { deriveEmailChangePublicState } from "@/lib/auth/emailChangeState";

const statuses: Record<EmailChangeCode, number> = {
  INVALID_REQUEST:400, ORIGIN_NOT_ALLOWED:403, EMAIL_CHANGE_NOT_AVAILABLE:403,
  EMAIL_CHANGE_REAUTH_REQUIRED:401, EMAIL_CHANGE_REAUTH_FAILED:403,
  EMAIL_CHANGE_IDENTITY_MISMATCH:403, EMAIL_CHANGE_EMAIL_INVALID:422,
  EMAIL_CHANGE_EMAIL_UNCHANGED:422, EMAIL_CHANGE_REQUEST_BLOCKED:409,
  EMAIL_CHANGE_REQUEST_ACCEPTED:202, EMAIL_CHANGE_REQUEST_ACCEPTED_CLEANUP_REQUIRED:202,
  EMAIL_CHANGE_UNAVAILABLE:503, EMAIL_CHANGE_STATUS_UNKNOWN:409, AUTH_STATE_UNAVAILABLE:503,
};
const reply=(code:EmailChangeCode)=>Response.json({code},{status:statuses[code],headers:EMAIL_CHANGE_RESPONSE_HEADERS});
type EmailChangeReservation={generation:number;correlationId:string};
function readReservation(value:unknown):EmailChangeReservation|null{
  const row=Array.isArray(value)?value[0]:value;
  if(!row||typeof row!=="object")return null;
  const generation=(row as Record<string,unknown>).generation;
  const correlationId=(row as Record<string,unknown>).correlation_id;
  if(typeof generation!=="number"||!Number.isSafeInteger(generation)||generation<1)return null;
  if(typeof correlationId!=="string"||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(correlationId))return null;
  return {generation,correlationId};
}
type EmailChangeAdmin=ReturnType<typeof createSupabaseServer>;
type EmailChangeConfiguration={url:string;key:string;site:string};
type EmailChangePostDependencies={
  createNormalClient:()=>Promise<EmailChangeNormalClient>;
  createAdminClient:()=>EmailChangeAdmin;
  createFreshClient:(url:string,key:string)=>EmailChangeFreshClient;
  readConfiguration:()=>EmailChangeConfiguration|null;
};
function readConfiguration():EmailChangeConfiguration|null{
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,site=process.env.NEXT_PUBLIC_SITE_URL;
  return url&&key&&site?{url,key,site}:null;
}
async function state(admin:EmailChangeAdmin,userId:string){
  const [request,job]=await Promise.all([
    admin.from("auth_email_change_requests").select("status").eq("user_id",userId).maybeSingle(),
    admin.from("auth_email_sync_jobs").select("status").eq("user_id",userId).maybeSingle(),
  ]);
  if(request.error||job.error)throw new Error("state unavailable");
  return {admin,requestStatus:request.data?.status??null,syncStatus:job.data?.status??null};
}
export async function GET(){
  try{
    const client=await createClient();
    const identity=await resolveEmailChangeIdentity(client as unknown as EmailChangeNormalClient);
    if(!identity.ok)return reply(identity.code);
    const current=await state(createSupabaseServer(),identity.userId);
    return Response.json({code:"EMAIL_CHANGE_"+deriveEmailChangePublicState(current.requestStatus,current.syncStatus).toUpperCase(),canonicalEmail:identity.email},{headers:EMAIL_CHANGE_RESPONSE_HEADERS});
  }catch{return reply("AUTH_STATE_UNAVAILABLE");}
}
export function createEmailChangePostHandler(dependencies:Partial<EmailChangePostDependencies>={}){
  const createNormalClient=dependencies.createNormalClient??(async()=>await createClient() as unknown as EmailChangeNormalClient);
  const createAdminClient=dependencies.createAdminClient??createSupabaseServer;
  const createFreshClient=dependencies.createFreshClient??createDefaultEmailChangeFreshClient;
  const readConfig=dependencies.readConfiguration??readConfiguration;
  return async function post(request:Request){
  if(request.headers.get("origin")!==new URL(request.url).origin)return reply("ORIGIN_NOT_ALLOWED");
  if(request.headers.get("content-type")?.split(";",1)[0].trim()!=="application/json")return reply("INVALID_REQUEST");
  const declared=Number(request.headers.get("content-length")??"0");
  if(!Number.isFinite(declared)||declared>EMAIL_CHANGE_MAX_BODY_BYTES)return reply("INVALID_REQUEST");
  let raw:string;
  try{raw=await request.text();}catch{return reply("INVALID_REQUEST");}
  if(new TextEncoder().encode(raw).byteLength>EMAIL_CHANGE_MAX_BODY_BYTES)return reply("INVALID_REQUEST");
  let body;try{body=parseEmailChangeBody(JSON.parse(raw));}catch{body=null;}
  if(!body)return reply("INVALID_REQUEST");
  if(!isValidEmailChange(body.newEmail))return reply("EMAIL_CHANGE_EMAIL_INVALID");
  let identity;
  try{
    const client=await createNormalClient();
    identity=await resolveEmailChangeIdentity(client);
  }catch{return reply("AUTH_STATE_UNAVAILABLE");}
  if(!identity.ok)return reply(identity.code);
  if(identity.email.trim().toLowerCase()===body.newEmail.toLowerCase())return reply("EMAIL_CHANGE_EMAIL_UNCHANGED");
  const configuration=readConfig();
  if(!configuration)return reply("EMAIL_CHANGE_UNAVAILABLE");
  let redirect:string;
  try{redirect=buildEmailChangeRedirect(configuration.site,body.language);}catch{return reply("EMAIL_CHANGE_UNAVAILABLE");}
  let admin:EmailChangeAdmin;
  try{admin=createAdminClient();}catch{return reply("EMAIL_CHANGE_UNAVAILABLE");}
  let fresh:EmailChangeFreshClient;
  try{fresh=createFreshClient(configuration.url,configuration.key);}catch{return reply("EMAIL_CHANGE_UNAVAILABLE");}
  let current;
  let reservation:EmailChangeReservation;
  try{
    current=await state(admin,identity.userId);
    const reserved=await current.admin.rpc("begin_auth_email_change_request",{p_user_id:identity.userId});
    const parsedReservation=reserved.error?null:readReservation(reserved.data);
    if(!parsedReservation)return reply("EMAIL_CHANGE_REQUEST_BLOCKED");
    reservation=parsedReservation;
  }catch{return reply("AUTH_STATE_UNAVAILABLE");}
  let markerAttempted=false;
  const action=createEmailChangeAction(fresh,identity,{currentPassword:body.currentPassword,newEmail:body.newEmail,redirect},async()=>{
    markerAttempted=true;
    const started=await current.admin.rpc("mark_auth_email_change_provider_mutation_started",{p_user_id:identity.userId,p_generation:reservation.generation,p_correlation_id:reservation.correlationId});
    return !started.error&&started.data===true;
  });
  const code=await action();
  const transition=getEmailChangeRequestTransition(code);
  try{
    if(transition==="accept"){
      const accepted=await current.admin.rpc("accept_auth_email_change_request",{p_user_id:identity.userId,p_generation:reservation.generation,p_correlation_id:reservation.correlationId});
      if(accepted.error||accepted.data!==true)return reply("EMAIL_CHANGE_STATUS_UNKNOWN");
    }else if(transition==="status_unknown"){
      const unknown=await current.admin.rpc("mark_auth_email_change_status_unknown",{p_user_id:identity.userId,p_generation:reservation.generation,p_correlation_id:reservation.correlationId});
      if(unknown.error||unknown.data!==true)return reply("EMAIL_CHANGE_STATUS_UNKNOWN");
    }else{
      const transitionName=markerAttempted?"fail_auth_email_change_request":"release_auth_email_change_before_provider";
      const failed=await current.admin.rpc(transitionName,{p_user_id:identity.userId,p_generation:reservation.generation,p_correlation_id:reservation.correlationId});
      if(failed.error||failed.data!==true)return reply("EMAIL_CHANGE_STATUS_UNKNOWN");
    }
  }catch{return reply("EMAIL_CHANGE_STATUS_UNKNOWN");}
  return reply(code);
  };
}
export const POST=createEmailChangePostHandler();
