import { readFile } from "node:fs/promises";
import { variants } from "../src/utils/measurement.ts";

// Private operator command. Never put this credential or report access into the browser.
const days = Number(process.argv[2] || 7);
if (!Number.isInteger(days) || days < 1 || days > 30) throw Error("Zvolte rozsah 1 až 30 dní.");
const base = process.env.SUPABASE_URL, key = process.env.SUPABASE_SECRET_KEY;
if (!base || !key) throw Error("Chybí soukromé nastavení Supabase v .env.local.");
const headers: Record<string,string> = { apikey:key };
if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;
let excluded: string[] = [];
try { excluded = JSON.parse(await readFile(new URL("../private-data/measurement-qc.json",import.meta.url),"utf8")).sessions || []; }
catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw Error("Neplatný soubor vyřazených testovacích návštěv."); }
type Row = {session_id:string;event:string;variant:string;created_at:string};
const rows: Row[] = [];
const after = new Date(Date.now()-days*86400000).toISOString();
for (let offset=0; ;offset+=1000) {
  const response = await fetch(`${base.replace(/\/$/,"")}/rest/v1/measurement_events?select=session_id,event,variant,created_at&order=created_at.asc,session_id.asc,event.asc&limit=1000&offset=${offset}`, {
    headers, signal:AbortSignal.timeout(10000),
  });
  if (!response.ok) throw Error(`Přehled není dostupný (HTTP ${response.status}).`);
  const page = await response.json() as Row[];
  rows.push(...page);
  if (page.length<1000) break;
  if (offset>=100000) throw Error("Přehled překročil lokální limit. Použijte souhrnný SQL dotaz v Supabase.");
}
const cohort = new Map(rows.filter(row=>row.event==="page_view" && row.created_at>=after && !excluded.includes(row.session_id)).map(row=>[row.session_id,row.variant]));
const counts = variants.map(variant=>{
  const subset=rows.filter(row=>cohort.get(row.session_id)===variant);
  const count=(event:string)=>subset.filter(row=>row.event===event).length;
  const visits=count("page_view"), contacts=count("contact_acquired"), starts=count("form_start"), successes=count("form_success");
  return { reklama:variant, návštěvy:visits, kalkulačka:count("calculator_use"), kvíz:count("quiz_use"), CTA:count("guide_cta"), zahájení:starts, dokončení:successes, nové_kontakty:contacts,
    konverze:visits?`${(100*contacts/visits).toFixed(2)} %`:"—", dokončení_formuláře:starts?`${(100*successes/starts).toFixed(2)} %`:"—" };
});
console.log(`Posledních ${days} dní, pouze návštěvy se souhlasem. Interní testy ze soukromého seznamu vyřazené.`);
console.table(counts);
if (!cohort.size) console.log("Zatím nejsou návštěvy vhodné k vyhodnocení; skutečná konverze není známá.");
