import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import { Measurement } from "../src/services/analytics.ts";
import { adVariant } from "../src/utils/measurement.ts";
import { handleEvent } from "../server/analytics.ts";

function storage() { const map = new Map<string,string>(); return {
  getItem: (key: string) => map.get(key) ?? null,
  setItem: (key: string,value: string) => { map.set(key,value); },
  removeItem: (key: string) => { map.delete(key); }, map,
}; }
test("Only known advertisement tags survive attribution", () => {
  assert.equal(adVariant("?utm_campaign=etf_porovnani&utm_content=ad_a_rozdily"),"ad_a_rozdily");
  assert.equal(adVariant("?utm_campaign=etf_porovnani&utm_content=ad_b_naklady&utm_term=secret"),"ad_b_naklady");
  assert.equal(adVariant("?utm_content=reader@example.invalid"),"other");
  assert.equal(adVariant("?email=reader@example.invalid"),"direct");
});
test("Opt-in, StrictMode/reload deduplication, withdrawal and storage failure", async () => {
  const local = storage(), tab = storage(), calls: object[] = [];
  const send = async (body: object) => { calls.push(body); return true; };
  const a = new Measurement(local,tab,"?utm_campaign=etf_porovnani&utm_content=ad_a_rozdily",send,randomUUID);
  a.start(false); await a.track("calculator_use");
  assert.equal(calls.length,0); assert.equal(tab.map.size,0);
  a.choose(true); a.start(true); await a.track("calculator_use"); await a.track("calculator_use");
  assert.equal(calls.length,2);
  const b = new Measurement(local,tab,"?utm_campaign=etf_porovnani&utm_content=ad_b_naklady",send,randomUUID);
  b.start(b.preference() === true); await b.track("guide_cta");
  assert.equal(calls.length,3); assert.match(JSON.stringify(calls[2]),/ad_a_rozdily/);
  b.choose(false); await b.track("form_start"); assert.equal(calls.length,3); assert.equal(tab.map.size,0);
  const denied = { getItem() { throw Error(); }, setItem() { throw Error(); }, removeItem() { throw Error(); } };
  const c = new Measurement(denied,denied,"",send,randomUUID);
  assert.equal(c.preference(),null); c.choose(true); await c.track("quiz_use"); c.choose(false);
});
test("Failed analytics can retry without breaking service or retaining a reserved event", async () => {
  let fails = true, calls = 0;
  const a = new Measurement(storage(),storage(),"",async () => { calls++; return !fails; },randomUUID);
  a.choose(true); await new Promise(resolve => setTimeout(resolve,0));
  fails = false; await a.track("page_view"); await a.track("page_view"); assert.equal(calls,2);
});
test("API rejects PII, arbitrary properties, forged conversions, origin mismatch and storage failure", async () => {
  const env = { APP_ORIGIN:"https://clientelo.example.invalid",SUPABASE_URL:"https://db.example.invalid",SUPABASE_SECRET_KEY:"test-key" };
  const input = {method:"POST",origin:env.APP_ORIGIN,contentType:"application/json",body:{sessionId:randomUUID(),event:"page_view",variant:"direct"}};
  const forbidden = async () => { throw Error("Must not call"); };
  assert.equal((await handleEvent({...input,body:{...input.body,email:"x@example.invalid"}},env,forbidden)).status,400);
  assert.equal((await handleEvent({...input,body:{...input.body,event:"form_success"}},env,forbidden)).status,400);
  assert.equal((await handleEvent({...input,origin:"https://bad.example.invalid"},env,forbidden)).status,403);
  assert.equal((await handleEvent(input,env,forbidden)).status,503);
  assert.equal((await handleEvent(input,env,async () => new Response('{"ok":true}'))).status,200);
});
test("Real PostgreSQL: event persistence, first touch, conversion verification, uniqueness, grants and retention", async () => {
  const db = new PGlite();
  try {
    await db.exec("create role anon; create role authenticated; create role service_role; grant usage on schema public to anon,authenticated,service_role;");
    for (const file of ["001-guide.sql","002-gmail.sql"]) await db.exec(await readFile(new URL(`../supabase/${file}`,import.meta.url),"utf8"));
    // pg_cron itself is hosted infrastructure; preserve the production migration unchanged.
    await db.exec("create schema cron; create function cron.schedule(text,text,text) returns int language sql as 'select 1';");
    await db.exec(await readFile(new URL("../supabase/003-measurement.sql",import.meta.url),"utf8"));
    const session = randomUUID(), request = randomUUID();
    const record = async (event: string,id: string|null=null,s=session,variant="ad_a_rozdily") =>
      (await db.query<{result:{ok:boolean}}>("select public.record_measurement($1,$2,$3,$4) result",[s,variant,event,id])).rows[0].result.ok;
    assert.equal(await record("form_success",request),false);
    await db.query("insert into public.guide_contacts(email,notice_version) values('synthetic@example.invalid','fixture')");
    await db.query("insert into public.guide_requests(id,email,notice_version,download_url,from_email,contact_email) values($1,'synthetic@example.invalid','fixture','https://example.invalid/guide.pdf','from@example.invalid','contact@example.invalid')",[request]);
    assert.equal(await record("form_success",request),false);
    await db.query("update public.guide_requests set mail_id='synthetic-not-sent' where id=$1",[request]);
    assert.equal(await record("form_success",request),true);
    await record("form_success",request); await record("form_success",request,randomUUID());
    for (const event of ["calculator_use","calculator_use","quiz_use","guide_cta","form_start"]) await record(event,null,session,"ad_b_naklady");
    const rows = (await db.query<{event:string;variant:string}>("select event,variant from public.measurement_events where session_id=$1",[session])).rows;
    assert.equal(rows.length,7); assert.ok(rows.every(row=>row.variant==="ad_a_rozdily"));
    assert.equal((await db.query("select * from public.measurement_events where event='contact_acquired'")).rows.length,1);
    const second = randomUUID();
    await db.query("insert into public.guide_requests(id,email,notice_version,download_url,from_email,contact_email,mail_id) values($1,'synthetic@example.invalid','fixture','https://example.invalid/guide.pdf','from@example.invalid','contact@example.invalid','synthetic-again')",[second]);
    await record("form_success",second,randomUUID());
    assert.equal((await db.query("select * from public.measurement_events where event='contact_acquired'")).rows.length,1);
    await db.exec("set role anon;");
    await assert.rejects(db.query("select * from public.measurement_events"),/permission denied/);
    await assert.rejects(record("page_view"),/permission denied/);
    await db.exec("reset role; update public.measurement_events set created_at=now()-interval '31 days'; select public.purge_expired_measurement();");
    assert.equal((await db.query("select * from public.measurement_events")).rows.length,0);
  } finally { await db.close(); }
});
