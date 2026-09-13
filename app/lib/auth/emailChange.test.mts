import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { AuthApiError, AuthRetryableFetchError } from "@supabase/auth-js";
import {
  buildEmailChangeRedirect, createEmailChangeAction, getEmailChangeRequestTransition, isValidEmailChange,
  parseEmailChangeBody, resolveEmailChangeIdentity,
  type EmailChangeFreshClient, type EmailChangeNormalClient,
} from "./emailChange.ts";
import { blocksEmailChangeRequest } from "./emailChangeState.ts";
import { createEmailChangePostHandler } from "../../api/auth/change-email/route.ts";

const USER = "11111111-1111-4111-8111-111111111111";
const MARKED = async () => true;
function normal(input: { sub?: string; amr?: unknown; email?: string | null } = {}): EmailChangeNormalClient {
  return { auth: {
    async getUser(){ return { data:{ user:{ id:USER, email: input.email === undefined ? "old@example.test" : input.email } }, error:null }; },
    async getClaims(){ return { data:{ claims:{ sub:input.sub??USER, amr:input.amr??[{method:"password"}] } }, error:null }; },
    mfa:{ async getAuthenticatorAssuranceLevel(){ return { data:{currentLevel:"aal1",nextLevel:"aal1"},error:null }; } },
  } };
}
function fresh(mode: "success"|"login-error"|"throw-login"|"login-mismatch"|"aal-error"|"update-mismatch"|"duplicate-email"|"duplicate-user"|"returned-failure"|"returned-conflict"|"returned-transport"|"returned-5xx"|"returned-unknown"|"throw-update"|"cleanup-failure" = "success") {
  const calls={login:0,update:0,global:0,local:0};
  const client:EmailChangeFreshClient={auth:{
    async signInWithPassword(){calls.login++;if(mode==="throw-login")throw new Error("unavailable");const id=mode==="login-mismatch"?"other":USER;return {data:{user:{id},session:{user:{id}}},error:mode==="login-error"?{}:null};},
    async updateUser(){calls.update++;if(mode==="throw-update")throw new Error("ambiguous");return {data:{user:{id:mode==="update-mismatch"?"other":USER}},error:mode==="duplicate-email"?new AuthApiError("destination unavailable",422,"email_exists"):mode==="duplicate-user"?new AuthApiError("destination unavailable",422,"user_already_exists"):mode==="returned-failure"?new AuthApiError("request rejected",400,"provider_failure"):mode==="returned-conflict"?new AuthApiError("request rejected",409,"provider_conflict"):mode==="returned-5xx"?new AuthApiError("provider unavailable",500,"provider_failure"):mode==="returned-transport"?new AuthRetryableFetchError("transport unavailable",504):mode==="returned-unknown"?{code:"unknown"}:null};},
    async signOut({scope}){calls[scope]++;return {error:mode==="cleanup-failure"&&scope==="global"?{}:null};},
    mfa:{async getAuthenticatorAssuranceLevel(){return {data:{currentLevel:"aal1",nextLevel:"aal1"},error:mode==="aal-error"?{}:null};}},
  }};
  return {client,calls};
}
function freshWithUpdateResult(result: unknown) {
  const state = fresh();
  state.client.auth.updateUser = (async () => {
    state.calls.update++;
    return result;
  }) as EmailChangeFreshClient["auth"]["updateUser"];
  return state;
}
function authApiErrorWithStatus(status: unknown) {
  const error = new AuthApiError("private", 400, "provider_failure");
  Object.defineProperty(error, "status", {
    configurable: true,
    get() {
      if (status instanceof Error) throw status;
      return status;
    },
  });
  return error;
}

test("schema, email and callback URL are closed",()=>{
  assert.deepEqual(parseEmailChangeBody({currentPassword:"x",newEmail:" new@example.test ",language:"nl"}),{currentPassword:"x",newEmail:"new@example.test",language:"nl"});
  assert.equal(parseEmailChangeBody({currentPassword:"x",newEmail:"x@y.z",language:"nl",userId:USER}),null);
  assert.equal(isValidEmailChange("bad"),false);
  assert.equal(buildEmailChangeRedirect("https://fitlifetool.com/path?x=1","pl"),"https://fitlifetool.com/auth/change-email/confirm?lang=pl");
  assert.throws(()=>buildEmailChangeRedirect("http://fitlifetool.com","en"));
});

test("server identity requires matching verified password-only aal1 claims",async()=>{
  assert.deepEqual(await resolveEmailChangeIdentity(normal()),{ok:true,userId:USER,email:"old@example.test"});
  assert.equal((await resolveEmailChangeIdentity(normal({sub:"other"}))).ok,false);
  assert.equal((await resolveEmailChangeIdentity(normal({amr:[{method:"oauth"}]}))).ok,false);
  assert.equal((await resolveEmailChangeIdentity(normal({email:null}))).ok,false);
});

test("provider mutation is one-shot and accepted requests immediately attempt global cleanup",async()=>{
  const state=fresh();
  const action=createEmailChangeAction(state.client,{userId:USER,email:"old@example.test"},{currentPassword:"secret",newEmail:"new@example.test",redirect:"https://fitlifetool.com/auth/change-email/confirm?lang=en"},MARKED);
  assert.equal(await action(),"EMAIL_CHANGE_REQUEST_ACCEPTED");
  assert.equal(await action(),"EMAIL_CHANGE_STATUS_UNKNOWN");
  assert.deepEqual(state.calls,{login:1,update:1,global:1,local:0});
});

test("ambiguous and untrustworthy update outcomes never retry or trigger global cleanup",async()=>{
  for(const mode of ["throw-update","returned-transport","returned-5xx","returned-unknown"] as const){
    const ambiguous=fresh(mode);
    const once=createEmailChangeAction(ambiguous.client,{userId:USER,email:"old@example.test"},{currentPassword:"x",newEmail:"n@example.test",redirect:"https://fitlifetool.com/auth/change-email/confirm?lang=en"},MARKED);
    assert.equal(await once(),"EMAIL_CHANGE_STATUS_UNKNOWN");
    assert.equal(await once(),"EMAIL_CHANGE_STATUS_UNKNOWN");
    assert.deepEqual(ambiguous.calls,{login:1,update:1,global:0,local:0});
  }
  const mismatch=fresh("update-mismatch");
  const untrusted=createEmailChangeAction(mismatch.client,{userId:USER,email:"old@example.test"},{currentPassword:"x",newEmail:"n@example.test",redirect:"https://fitlifetool.com/auth/change-email/confirm?lang=en"},MARKED);
  assert.equal(await untrusted(),"EMAIL_CHANGE_STATUS_UNKNOWN");
  assert.equal(await untrusted(),"EMAIL_CHANGE_STATUS_UNKNOWN");
  assert.deepEqual(mismatch.calls,{login:1,update:1,global:0,local:0});
  const cleanup=fresh("cleanup-failure");
  assert.equal(await createEmailChangeAction(cleanup.client,{userId:USER,email:"old@example.test"},{currentPassword:"x",newEmail:"n@example.test",redirect:"https://fitlifetool.com/auth/change-email/confirm?lang=en"},MARKED)(),"EMAIL_CHANGE_REQUEST_ACCEPTED_CLEANUP_REQUIRED");
  assert.deepEqual(cleanup.calls,{login:1,update:1,global:1,local:0});
});

test("malformed resolved provider envelopes are bounded and remain one-shot", async () => {
  const malformedResults: unknown[] = [
    null,
    undefined,
    {},
    { data: null },
    { data: {}, error: null },
    "unexpected",
    42,
    true,
    [],
    { data: { user: "unexpected" }, error: null },
    { data: { user: { profile: { id: USER } } }, error: null },
  ];

  for (const malformed of malformedResults) {
    const state = freshWithUpdateResult(malformed);
    const action = createEmailChangeAction(
      state.client,
      { userId: USER, email: "old@example.test" },
      { currentPassword: "x", newEmail: "n@example.test", redirect: "https://fitlifetool.com/auth/change-email/confirm?lang=en" },
      MARKED
    );
    assert.equal(await action(), "EMAIL_CHANGE_STATUS_UNKNOWN");
    assert.equal(await action(), "EMAIL_CHANGE_STATUS_UNKNOWN");
    assert.deepEqual(state.calls, { login: 1, update: 1, global: 0, local: 0 });
  }
});

test("hostile nested provider errors are exception-contained and never become definitive", async () => {
  const throwingName = { __isAuthError: true };
  Object.defineProperty(throwingName, "name", { get(){throw new Error("nested name getter");} });
  const throwingCode = {};
  Object.defineProperty(throwingCode, "code", { get(){throw new Error("nested code getter");} });
  const throwingMessage = {};
  Object.defineProperty(throwingMessage, "message", { get(){throw new Error("nested message getter");} });
  const throwingProxy = new Proxy({}, { has(){throw new Error("nested proxy trap");} });
  const throwingEnvelope = { data:{user:null} } as { data:{user:null}; error?:unknown };
  Object.defineProperty(throwingEnvelope, "error", { get(){throw new Error("envelope error getter");} });
  const hostileResults = [
    {data:{user:null},error:authApiErrorWithStatus(new Error("nested status getter"))},
    {data:{user:null},error:authApiErrorWithStatus("400")},
    {data:{user:null},error:authApiErrorWithStatus(Number.NaN)},
    {data:{user:null},error:Object.defineProperty({},"status",{get(){throw new Error("non-auth status getter");}})},
    {data:{user:null},error:throwingName},
    {data:{user:null},error:throwingCode},
    {data:{user:null},error:throwingMessage},
    {data:{user:null},error:throwingProxy},
    throwingEnvelope,
  ];

  for (const hostile of hostileResults) {
    const state = freshWithUpdateResult(hostile);
    const action = createEmailChangeAction(
      state.client,
      {userId:USER,email:"old@example.test"},
      {currentPassword:"x",newEmail:"n@example.test",redirect:"https://fitlifetool.com/auth/change-email/confirm?lang=en"},
      MARKED
    );
    assert.equal(await action(), "EMAIL_CHANGE_STATUS_UNKNOWN");
    assert.equal(await action(), "EMAIL_CHANGE_STATUS_UNKNOWN");
    assert.deepEqual(state.calls, {login:1,update:1,global:0,local:0});
  }
});

test("only safely recognized AuthApiError 4xx results are definitive", async () => {
  for (const status of [400,409,429]) {
    const state = freshWithUpdateResult({data:{user:null},error:new AuthApiError("private",status,"provider_failure")});
    const action = createEmailChangeAction(state.client,{userId:USER,email:"old@example.test"},{currentPassword:"x",newEmail:"n@example.test",redirect:"https://fitlifetool.com/auth/change-email/confirm?lang=en"},MARKED);
    assert.equal(await action(), "EMAIL_CHANGE_UNAVAILABLE");
    assert.deepEqual(state.calls, {login:1,update:1,global:0,local:1});
  }
  for (const error of [new AuthApiError("private",500,"provider_failure"),new Error("unknown")]) {
    const state = freshWithUpdateResult({data:{user:null},error});
    const action = createEmailChangeAction(state.client,{userId:USER,email:"old@example.test"},{currentPassword:"x",newEmail:"n@example.test",redirect:"https://fitlifetool.com/auth/change-email/confirm?lang=en"},MARKED);
    assert.equal(await action(), "EMAIL_CHANGE_STATUS_UNKNOWN");
    assert.deepEqual(state.calls, {login:1,update:1,global:0,local:0});
  }
});

test("a hostile nested provider error reaches only the bounded route transition", async () => {
  for (const transitionFails of [false,true]) {
    const rpcCalls:string[]=[];
    const query={select(){return this;},eq(){return this;},async maybeSingle(){return {data:null,error:null};}};
    const admin={
      from(){return query;},
      async rpc(name:string){
        rpcCalls.push(name);
        if(name==="begin_auth_email_change_request")return {data:[{generation:1,correlation_id:"11111111-1111-4111-8111-111111111111"}],error:null};
        if(name==="mark_auth_email_change_status_unknown"&&transitionFails)throw new Error("transition unavailable");
        return {data:true,error:null};
      },
    };
    const hostile=freshWithUpdateResult({data:{user:null},error:authApiErrorWithStatus(new Error("nested getter"))});
    const handler=createEmailChangePostHandler({
      createNormalClient:async()=>normal(),
      readConfiguration:()=>({url:"https://local.test",key:"anon",site:"https://fitlifetool.test"}),
      createAdminClient:()=>admin as never,
      createFreshClient:()=>hostile.client,
    });
    const response=await handler(new Request("https://fitlifetool.test/api/auth/change-email",{
      method:"POST",headers:{origin:"https://fitlifetool.test","content-type":"application/json"},
      body:JSON.stringify({currentPassword:"secret",newEmail:"new@example.test",language:"en"}),
    }));
    assert.equal(response.status,409);
    assert.deepEqual(await response.json(),{code:"EMAIL_CHANGE_STATUS_UNKNOWN"});
    assert.deepEqual(rpcCalls,["begin_auth_email_change_request","mark_auth_email_change_provider_mutation_started","mark_auth_email_change_status_unknown"]);
    assert.deepEqual(hostile.calls,{login:1,update:1,global:0,local:0});
  }
});

test("the route persists a malformed resolved provider envelope as bounded status unknown", async () => {
  const rpcCalls: string[] = [];
  const query = { select(){return this;}, eq(){return this;}, async maybeSingle(){return {data:null,error:null};} };
  const admin = {
    from(){return query;},
    async rpc(name: string) {
      rpcCalls.push(name);
      if (name === "begin_auth_email_change_request") {
        return {data:[{generation:1,correlation_id:"11111111-1111-4111-8111-111111111111"}],error:null};
      }
      return {data:true,error:null};
    },
  };
  const malformed = freshWithUpdateResult(null);
  const handler = createEmailChangePostHandler({
    createNormalClient: async () => normal(),
    readConfiguration: () => ({url:"https://local.test",key:"anon",site:"https://fitlifetool.test"}),
    createAdminClient: () => admin as never,
    createFreshClient: () => malformed.client,
  });
  const response = await handler(new Request("https://fitlifetool.test/api/auth/change-email", {
    method: "POST",
    headers: {origin:"https://fitlifetool.test","content-type":"application/json"},
    body: JSON.stringify({currentPassword:"secret",newEmail:"new@example.test",language:"en"}),
  }));
  assert.equal(response.status, 409);
  assert.deepEqual(await response.json(), {code:"EMAIL_CHANGE_STATUS_UNKNOWN"});
  assert.deepEqual(rpcCalls, [
    "begin_auth_email_change_request",
    "mark_auth_email_change_provider_mutation_started",
    "mark_auth_email_change_status_unknown",
  ]);
  assert.deepEqual(malformed.calls, {login:1,update:1,global:0,local:0});
});

test("returned transport ambiguity remains durably locked before a second HTTP mutation",()=>{
  assert.equal(getEmailChangeRequestTransition("EMAIL_CHANGE_STATUS_UNKNOWN"),"status_unknown");
  assert.equal(blocksEmailChangeRequest("status_unknown"),true);
  assert.equal(getEmailChangeRequestTransition("EMAIL_CHANGE_UNAVAILABLE"),"fail");
  assert.equal(getEmailChangeRequestTransition("EMAIL_CHANGE_REQUEST_ACCEPTED"),"accept");
});

test("all definitive provider rejections use one generic bounded result",async()=>{
  for(const [mode,expected] of [["login-mismatch","EMAIL_CHANGE_IDENTITY_MISMATCH"],["duplicate-email","EMAIL_CHANGE_UNAVAILABLE"],["duplicate-user","EMAIL_CHANGE_UNAVAILABLE"],["returned-failure","EMAIL_CHANGE_UNAVAILABLE"],["returned-conflict","EMAIL_CHANGE_UNAVAILABLE"]] as const){
    const state=fresh(mode);const action=createEmailChangeAction(state.client,{userId:USER,email:"old@example.test"},{currentPassword:"x",newEmail:"n@example.test",redirect:"https://fitlifetool.com/auth/change-email/confirm?lang=en"},MARKED);
    assert.equal(await action(),expected);assert.equal(state.calls.update,mode==="login-mismatch"?0:1);assert.equal(state.calls.global,0);assert.equal(state.calls.local,1);
  }
});

test("the route persists duplicate rejection as failed and returns generic unavailable",async()=>{
  const rpcCalls:string[]=[];
  const query={select(){return this;},eq(){return this;},async maybeSingle(){return {data:null,error:null};}};
  const admin={
    from(){return query;},
    async rpc(name:string){
      rpcCalls.push(name);
      if(name==="begin_auth_email_change_request")return {data:[{generation:1,correlation_id:"11111111-1111-4111-8111-111111111111"}],error:null};
      return {data:true,error:null};
    },
  };
  const duplicate=fresh("duplicate-email");
  const handler=createEmailChangePostHandler({
    createNormalClient:async()=>normal(),
    readConfiguration:()=>({url:"https://local.test",key:"anon",site:"https://fitlifetool.test"}),
    createAdminClient:()=>admin as never,
    createFreshClient:()=>duplicate.client,
  });
  const response=await handler(new Request("https://fitlifetool.test/api/auth/change-email",{
    method:"POST",
    headers:{origin:"https://fitlifetool.test","content-type":"application/json"},
    body:JSON.stringify({currentPassword:"secret",newEmail:"duplicate@example.test",language:"en"}),
  }));
  assert.equal(response.status,503);
  assert.deepEqual(await response.json(),{code:"EMAIL_CHANGE_UNAVAILABLE"});
  assert.deepEqual(rpcCalls,["begin_auth_email_change_request","mark_auth_email_change_provider_mutation_started","fail_auth_email_change_request"]);
  assert.deepEqual(duplicate.calls,{login:1,update:1,global:0,local:1});
});

test("the route keeps actual provider acceptance pending and publicly accepted",async()=>{
  const rpcCalls:string[]=[];
  const query={select(){return this;},eq(){return this;},async maybeSingle(){return {data:null,error:null};}};
  const admin={
    from(){return query;},
    async rpc(name:string){
      rpcCalls.push(name);
      if(name==="begin_auth_email_change_request")return {data:[{generation:1,correlation_id:"11111111-1111-4111-8111-111111111111"}],error:null};
      return {data:true,error:null};
    },
  };
  const accepted=fresh();
  const handler=createEmailChangePostHandler({
    createNormalClient:async()=>normal(),
    readConfiguration:()=>({url:"https://local.test",key:"anon",site:"https://fitlifetool.test"}),
    createAdminClient:()=>admin as never,
    createFreshClient:()=>accepted.client,
  });
  const response=await handler(new Request("https://fitlifetool.test/api/auth/change-email",{
    method:"POST",
    headers:{origin:"https://fitlifetool.test","content-type":"application/json"},
    body:JSON.stringify({currentPassword:"secret",newEmail:"new@example.test",language:"en"}),
  }));
  assert.equal(response.status,202);
  assert.deepEqual(await response.json(),{code:"EMAIL_CHANGE_REQUEST_ACCEPTED"});
  assert.deepEqual(rpcCalls,["begin_auth_email_change_request","mark_auth_email_change_provider_mutation_started","accept_auth_email_change_request"]);
  assert.deepEqual(accepted.calls,{login:1,update:1,global:1,local:0});
});

test("production code contains no duplicate-specific provider branch or public remap",async()=>{
  const actionSource=await readFile(new URL("./emailChange.ts",import.meta.url),"utf8");
  const routeSource=await readFile(new URL("../../../app/api/auth/change-email/route.ts",import.meta.url),"utf8");
  for(const source of [actionSource,routeSource]){
    assert.doesNotMatch(source,/EMAIL_CHANGE_DESTINATION_UNAVAILABLE|email_exists|user_already_exists|error\.message|console\./);
  }
});

test("same-current email is rejected before reservation, fresh auth, or provider mutation",async()=>{
  let adminConstructions=0,freshConstructions=0;
  const handler=createEmailChangePostHandler({
    createNormalClient:async()=>normal(),
    readConfiguration:()=>{throw new Error("must not be reached");},
    createAdminClient:()=>{adminConstructions++;throw new Error("must not be reached");},
    createFreshClient:()=>{freshConstructions++;return fresh().client;},
  });
  const response=await handler(new Request("https://fitlifetool.test/api/auth/change-email",{
    method:"POST",
    headers:{origin:"https://fitlifetool.test","content-type":"application/json"},
    body:JSON.stringify({currentPassword:"secret",newEmail:" OLD@example.test ",language:"en"}),
  }));
  assert.equal(response.status,422);
  assert.deepEqual(await response.json(),{code:"EMAIL_CHANGE_EMAIL_UNCHANGED"});
  assert.equal(adminConstructions,0);
  assert.equal(freshConstructions,0);
});

test("request route enforces origin, JSON, size, exact schema and durable reservation before mutation",async()=>{
  const source=await readFile(new URL("../../../app/api/auth/change-email/route.ts",import.meta.url),"utf8");
  const post=source.slice(source.indexOf("export function createEmailChangePostHandler"));
  for(const token of ["ORIGIN_NOT_ALLOWED","application/json","EMAIL_CHANGE_MAX_BODY_BYTES","parseEmailChangeBody","begin_auth_email_change_request","readReservation","getEmailChangeRequestTransition","mark_auth_email_change_provider_mutation_started","release_auth_email_change_before_provider","mark_auth_email_change_status_unknown"]){assert.match(source,new RegExp(token));}
  for(const prerequisite of ["readConfig()","buildEmailChangeRedirect","createAdminClient()","createFreshClient"]){
    assert.ok(post.indexOf(prerequisite)<post.indexOf("begin_auth_email_change_request"));
  }
  assert.ok(post.indexOf("begin_auth_email_change_request")<post.indexOf("createEmailChangeAction("));
  assert.ok(post.indexOf("mark_auth_email_change_provider_mutation_started")<post.indexOf("const code=await action()"));
  for(const transition of ["accept_auth_email_change_request","mark_auth_email_change_status_unknown"]){
    const start=source.indexOf(`rpc("${transition}"`);
    const call=source.slice(start,source.indexOf(");",start)+2);
    assert.notEqual(start,-1);
    assert.match(call,/p_generation:reservation\.generation/);
    assert.match(call,/p_correlation_id:reservation\.correlationId/);
  }
  assert.match(source,/markerAttempted\?"fail_auth_email_change_request":"release_auth_email_change_before_provider"/);
  assert.doesNotMatch(source,/console\.|error\.message|body\.(?:userId|user_id|emailRedirectTo)/);
});

test("admin configuration failure is bounded before reservation and reauthentication",async()=>{
  let freshConstructions=0;
  const handler=createEmailChangePostHandler({
    createNormalClient:async()=>normal(),
    readConfiguration:()=>({url:"https://local.test",key:"anon",site:"https://fitlifetool.test"}),
    createAdminClient:()=>{throw new Error("missing private configuration");},
    createFreshClient:()=>{freshConstructions++;return fresh().client;},
  });
  const response=await handler(new Request("https://fitlifetool.test/api/auth/change-email",{
    method:"POST",
    headers:{origin:"https://fitlifetool.test","content-type":"application/json"},
    body:JSON.stringify({currentPassword:"secret",newEmail:"new@example.test",language:"en"}),
  }));
  assert.equal(response.status,503);
  assert.deepEqual(await response.json(),{code:"EMAIL_CHANGE_UNAVAILABLE"});
  assert.equal(freshConstructions,0);
  const helperSource=await readFile(new URL("../supabase/supabaseServer.ts",import.meta.url),"utf8");
  assert.ok(helperSource.indexOf("export function createSupabaseServer")<helperSource.indexOf("process.env.NEXT_PUBLIC_SUPABASE_URL"));
});

test("a stale recovery observation cannot cross a rejected atomic begin",async()=>{
  let updateCalls=0;
  let rpcCalls=0;
  const query={select(){return this;},eq(){return this;},async maybeSingle(){return {data:null,error:null};}};
  const admin={
    from(){return query;},
    async rpc(name:string){rpcCalls++;assert.equal(name,"begin_auth_email_change_request");return {data:[],error:null};},
  };
  const blockedFresh=fresh();
  blockedFresh.client.auth.updateUser=async()=>{updateCalls++;return {data:{user:{id:USER}},error:null};};
  const handler=createEmailChangePostHandler({
    createNormalClient:async()=>normal(),
    readConfiguration:()=>({url:"https://local.test",key:"anon",site:"https://fitlifetool.test"}),
    createAdminClient:()=>admin as never,
    createFreshClient:()=>blockedFresh.client,
  });
  const response=await handler(new Request("https://fitlifetool.test/api/auth/change-email",{
    method:"POST",
    headers:{origin:"https://fitlifetool.test","content-type":"application/json"},
    body:JSON.stringify({currentPassword:"secret",newEmail:"new@example.test",language:"en"}),
  }));
  assert.equal(response.status,409);
  assert.deepEqual(await response.json(),{code:"EMAIL_CHANGE_REQUEST_BLOCKED"});
  assert.equal(rpcCalls,1);
  assert.equal(updateCalls,0);
});

test("provider mutation requires confirmed durable mutation-start evidence",async()=>{
  for(const marker of [async()=>false,async()=>{throw new Error("unknown persistence");}]){
    const state=fresh();
    const action=createEmailChangeAction(state.client,{userId:USER,email:"old@example.test"},{currentPassword:"x",newEmail:"n@example.test",redirect:"https://fitlifetool.com/auth/change-email/confirm?lang=en"},marker);
    assert.equal(await action(),"EMAIL_CHANGE_STATUS_UNKNOWN");
    assert.equal(await action(),"EMAIL_CHANGE_STATUS_UNKNOWN");
    assert.deepEqual(state.calls,{login:1,update:0,global:0,local:1});
  }
});

test("definitive pre-mutation failures never cross the durable marker boundary",async()=>{
  for(const [mode,expected] of [["login-error","EMAIL_CHANGE_REAUTH_FAILED"],["throw-login","EMAIL_CHANGE_UNAVAILABLE"],["login-mismatch","EMAIL_CHANGE_IDENTITY_MISMATCH"],["aal-error","EMAIL_CHANGE_NOT_AVAILABLE"]] as const){
    const state=fresh(mode);let markers=0;
    const action=createEmailChangeAction(state.client,{userId:USER,email:"old@example.test"},{currentPassword:"x",newEmail:"n@example.test",redirect:"https://fitlifetool.com/auth/change-email/confirm?lang=en"},async()=>{markers++;return true;});
    assert.equal(await action(),expected);
    assert.equal(markers,0);
    assert.equal(state.calls.update,0);
    assert.equal(state.calls.local,1);
  }
});

test("the production action places the marker immediately before its one update attempt",async()=>{
  const source=await readFile(new URL("./emailChange.ts",import.meta.url),"utf8");
  const marker=source.indexOf("await markProviderMutationStarted()");
  const update=source.indexOf("await fresh.auth.updateUser");
  assert.ok(marker>=0&&update>marker);
  assert.doesNotMatch(source.slice(marker,update),/signInWithPassword|getAuthenticatorAssuranceLevel/);
});
