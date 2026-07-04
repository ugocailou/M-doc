import { getStore } from "@netlify/blobs";

const SEED = [
  {id:"001",ref:"REF/MED/2026-0512-Z",name:"Zerath Cobalt",date:"12 / 05 / 2026",unit:"Admission · Soins intensifs",status:"traite",category:"Soins intensifs",tags:["Brûlure","Chirurgie oculaire"],summary:"Brûlure au flanc droit et retrait d'un œil nécrosé. Implant orbitaire provisoire posé.",body:"ANTÉCÉDENTS — Soins DPPA préalables. Brûlure flanc droit.\nINTERVENTIONS — Retrait œil nécrosé orbite droite. Implant orbitaire provisoire.\nTRAITEMENT — Antalgiques, Antibiotiques, Protection œil sain."},
  {id:"002",ref:"REF/MED/2026-0512-F",name:"Diane Flori",date:"12 / 05 / 2026 → 13 / 05 / 2026",unit:"Admission · Urgences chirurgicales",status:"traite",category:"Neurochirurgie",tags:["Polytraumatisée","Éclats de grenade","Neurochirurgie"],summary:"Polytraumatisme par explosion. Neurochirurgie crânienne, drainage thoracique. Réveil confirmé.",body:"⚠ ERREUR MÉDICALE — Perfusion AB+ sur groupe O+ (Dr. Katchum). Insuffisance rénale aiguë corrigée.\nMEMBRES — Éclats extraits, tulle gras. Brûlures jambe.\nNEUROCHIRURGIE — Plaque métallique, agrafes scalp.\nTHORAX — Débris retirés, valve drainage 2e espace intercostal.\nBASSIN — Fêlure, fauteuil roulant.\nTRAITEMENT — Mannitol, Antibiotiques, Morphine, Kétamine.\n✓ Réveil 13/05/2026 à 22H16."},
  {id:"003",ref:"REF/MED/2026-0515-T",name:"Tadao",date:"15 / 05 / 2026",unit:"Admission · Soins chirurgicaux",status:"traite",category:"Chirurgie",tags:["Infection","Amputation","Épaule"],summary:"Infection du moignon après désarticulation d'épaule. Débridement et antibiothérapie.",body:"⚠ INFECTION POST-AMPUTATION — Foyer infectieux actif moignon épaule droite.\nINTERVENTIONS — Ablation sutures infectées, lavage, débridement, pansement hydrofibres, Baie Oran, Comfey.\nTRAITEMENT — Antibiotiques IV, anti-inflammatoires locaux."},
  {id:"004",ref:"REF/MED/2026-0515-AD",name:"Alex Delacroix",date:"15 / 05 / 2026",unit:"Consultation externe",status:"traite",category:"Toxicologie",tags:["Intoxication","Spores Raphlesia"],summary:"Intoxication involontaire par spores de Raphlesia. Aucun traitement administré.",body:"Intoxication spores Raphlesia sans consentement. Perte de connaissance prolongée. Aucun traitement.\nPREUVES — Spores microscope, GABA élevé, mélatonine induite, résidus polliniques documentés.\n⚖ Preuve recevable Ligue Pokémon."},
  {id:"005",ref:"REF/MED/2026-0515-YY",name:"Yummi Yamo",date:"15 / 05 / 2026",unit:"Consultation externe",status:"traite",category:"Toxicologie",tags:["Intoxication","Spores Raphlesia"],summary:"Intoxication involontaire par spores de Raphlesia. Aucun traitement administré.",body:"Intoxication spores Raphlesia sans consentement. Perte de connaissance prolongée. Aucun traitement.\nPREUVES — Spores microscope, GABA élevé, mélatonine induite, résidus polliniques documentés.\n⚖ Preuve recevable Ligue Pokémon."},
  {id:"006",ref:"REF/MED/2026-0515-TD",name:"Tony Delord",date:"15 / 05 / 2026",unit:"Admission · Urgences chirurgicales",status:"traite",category:"Médecine légale",tags:["Pendaison forcée","Médico-légal"],summary:"Pendaison forcée suivie d'une chute. Réveil confirmé, sortie autorisée.",body:"⚠ SIGNALEMENT — Pendaison forcée, marques de lutte, autorités prévenues.\nINTERVENTIONS — Intubation, scanner (RAS), écho-doppler (RAS), prélèvements.\nTRAITEMENT — Corticoïdes IV, Mannitol, Morphine, Antibiotiques.\n✓ Réveil confirmé, sortie autorisée."},
  {id:"007",ref:"REF/MED/2026-0515-KU",name:"Kimaru Ukasai",date:"15 / 05 / 2026",unit:"Admission · Traumatologie",status:"traite",category:"Traumatologie",tags:["Fracture","Chute 3-4m"],summary:"Fractures légères col du fémur et calcanéum. Sortie avec béquille.",body:"Chute 3-4m sur membres inférieurs.\nDIAGNOSTICS — Fracture légère col fémur + calcanéum.\nTRAITEMENT — Antalgie, crème Baie Sitrus, béquille.\n✓ Sortie autorisée, suivi externe."},
  {id:"001-OP",ref:"REF/MED/2026-0623-ZC",name:"Zerath Cobalt",date:"23 / 06 / 2026",unit:"Chirurgie programmée · Bloc opératoire",status:"traite",category:"Chirurgie",tags:["Chirurgie oculaire","Prothèse main"],summary:"Double intervention : orbite définitive + prothèse main (pouce, index, paume). Aucune complication.",body:"ORBITE — Implant orbitaire définitif, conformateur acrylique, Tobramycine.\nMAIN — Plaque palmaire titane, pouce + index prothétiques verrouillés, Histoacryl, Baie Sitrus.\n✓ Aucune complication. Suivi : œil de verre définitif en externe."},
  {id:"008",ref:"REF/MED/2026-0623-LP",name:"Léo Poulino",date:"23 / 06 / 2026",unit:"Admission · Urgences chirurgicales",status:"traite",category:"Traumatologie",tags:["Fractures costales","Fracture fémur"],summary:"Trois côtes + fémur opérés simultanément. Aucune complication.",body:"CÔTES — 3 fractures, plaques titane, étanchéité confirmée.\nFÉMUR — Clou centromédullaire titane verrouillé, attelle plâtrée.\nTRAITEMENT — Antibiotiques, Morphine, Anticoagulants, Baie Sitrus.\n✓ Contrôle radio à 6 semaines."},
  {id:"ML-001",ref:"REF/MED/2026-0623-ML",name:"Balash Mové",date:"23 / 06 / 2026 · 18H36",unit:"Unité médico-légale · Autopsie",status:"deces",category:"Médecine légale",tags:["Décès","Traumatisme crânien","Autopsie"],summary:"Autopsie. Décès par traumatisme crânien occipital. Toxicologie négative.",body:"Décès 18H36 le 23/06/2026. Lieu non communiqué.\nEXTERNE — Plaie occipitale, enfoncement osseux.\nINTERNE — Fracture occipitale, hématome extradural massif, engagement cérébral fatal.\nTOXICO — Tout négatif.\n✓ Cause traumatique. Rapport transmis aux autorités."}
];

export default async (req) => {
  if (req.method !== "POST") return new Response("POST only", { status: 405 });
  const db = getStore("dossiers-medicaux");
  const existing = await db.get("index", { type: "json" });
  if (Array.isArray(existing) && existing.length > 0) {
    return new Response(JSON.stringify({ ok: true, seeded: false, count: existing.length }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  const seeded = SEED.map(r => ({ ...r, createdAt: new Date().toISOString() }));
  await db.setJSON("index", seeded);
  return new Response(JSON.stringify({ ok: true, seeded: true, count: seeded.length }), {
    headers: { "Content-Type": "application/json" }
  });
};

export const config = { path: "/api/seed" };
