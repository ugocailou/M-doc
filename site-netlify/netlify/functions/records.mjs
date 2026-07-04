import { getStore } from "@netlify/blobs";

// Stockage partagé au niveau du site : les données sont accessibles
// et identiques pour TOUS les visiteurs, et persistent entre les déploiements.
// "strong" garantit qu'un ajout est immédiatement lisible par tout le monde.
const store = () => getStore({ name: "dossiers-medicaux", consistency: "strong" });

const KEY = "index"; // une seule clé JSON contenant le tableau des dossiers

const json = (status, data) => ({
  statusCode: status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  },
  body: JSON.stringify(data),
});

async function readAll() {
  const data = await store().get(KEY, { type: "json" });
  return Array.isArray(data) ? data : [];
}

async function writeAll(list) {
  await store().setJSON(KEY, list);
}

// Nettoie / borne une chaîne pour éviter les abus
function clean(v, max = 4000) {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

export default async (req) => {
  try {
    // ---- LISTE ----
    if (req.method === "GET") {
      const list = await readAll();
      return json(200, { ok: true, records: list });
    }

    // ---- AJOUT ----
    if (req.method === "POST") {
      let payload;
      try {
        payload = await req.json();
      } catch {
        return json(400, { ok: false, error: "Corps de requête invalide." });
      }

      const name = clean(payload.name, 120);
      if (!name) {
        return json(400, { ok: false, error: "Le nom du patient est obligatoire." });
      }

      const record = {
        id: clean(payload.id, 40) || "D-" + Date.now().toString(36).toUpperCase(),
        ref: clean(payload.ref, 60) || "REF/MED/" + new Date().getFullYear() + "-LIBRE",
        name,
        date: clean(payload.date, 60) || new Date().toLocaleDateString("fr-FR"),
        unit: clean(payload.unit, 120) || "Admission",
        status: ["traite", "encours", "deces"].includes(payload.status) ? payload.status : "encours",
        category: clean(payload.category, 60) || "Général",
        tags: Array.isArray(payload.tags)
          ? payload.tags.slice(0, 8).map((t) => clean(String(t), 40)).filter(Boolean)
          : [],
        summary: clean(payload.summary, 600),
        body: clean(payload.body, 8000),
        createdAt: new Date().toISOString(),
      };

      const list = await readAll();
      list.push(record);
      await writeAll(list);

      return json(201, { ok: true, record });
    }

    // ---- SUPPRESSION (optionnel, par id) ----
    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");
      if (!id) return json(400, { ok: false, error: "id manquant." });
      const list = await readAll();
      const next = list.filter((r) => r.id !== id);
      await writeAll(next);
      return json(200, { ok: true, removed: list.length - next.length });
    }

    return json(405, { ok: false, error: "Méthode non autorisée." });
  } catch (err) {
    return json(500, { ok: false, error: "Erreur serveur : " + err.message });
  }
};

// Route l'endpoint sur /api/records
export const config = { path: "/api/records" };
