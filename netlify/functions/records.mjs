import { getStore } from "@netlify/blobs";

const getDb = () => getStore("dossiers-medicaux");
const KEY = "index";

const res = (status, data) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json" }
});

function clean(v, max = 4000) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export default async (req) => {
  const db = getDb();

  if (req.method === "GET") {
    const data = await db.get(KEY, { type: "json" });
    return res(200, { ok: true, records: Array.isArray(data) ? data : [] });
  }

  if (req.method === "POST") {
    let p;
    try { p = await req.json(); } catch { return res(400, { ok: false, error: "JSON invalide" }); }
    const name = clean(p.name, 120);
    if (!name) return res(400, { ok: false, error: "Nom obligatoire." });
    const record = {
      id: clean(p.id, 40) || "D-" + Date.now().toString(36).toUpperCase(),
      ref: clean(p.ref, 60) || "REF/MED/" + new Date().getFullYear(),
      name,
      date: clean(p.date, 60) || new Date().toLocaleDateString("fr-FR"),
      unit: clean(p.unit, 120) || "Admission",
      status: ["traite","encours","deces"].includes(p.status) ? p.status : "encours",
      category: clean(p.category, 60) || "Général",
      tags: Array.isArray(p.tags) ? p.tags.slice(0,8).map(t=>clean(String(t),40)).filter(Boolean) : [],
      summary: clean(p.summary, 600),
      body: clean(p.body, 8000),
      createdAt: new Date().toISOString(),
    };
    const list = (await db.get(KEY, { type: "json" })) || [];
    list.push(record);
    await db.setJSON(KEY, list);
    return res(201, { ok: true, record });
  }

  if (req.method === "DELETE") {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return res(400, { ok: false, error: "id manquant" });
    const list = (await db.get(KEY, { type: "json" })) || [];
    await db.setJSON(KEY, list.filter(r => r.id !== id));
    return res(200, { ok: true });
  }

  return res(405, { ok: false, error: "Méthode non autorisée" });
};

export const config = { path: "/api/records" };
