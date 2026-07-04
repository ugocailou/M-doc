# Archives Médicales — Centre Hospitalier Flankin

Site d'archives médicales avec **ajout de dossiers directement depuis le site**.
Chaque dossier ajouté est **partagé et visible par tous les visiteurs**, grâce à
**Netlify Blobs** (stockage serveur natif de Netlify — gratuit, sans base de données à configurer).

---

## Ce qui est inclus

```
site-netlify/
├── public/
│   └── index.html            → le site (recherche + formulaire d'ajout)
├── netlify/
│   └── functions/
│       ├── records.mjs        → API partagée : liste (GET), ajout (POST), suppression (DELETE)
│       └── seed.mjs           → pré-remplit le registre avec les 11 dossiers existants
├── netlify.toml               → configuration Netlify
└── package.json               → dépendance @netlify/blobs
```

- **Recherche** par nom de patient (instantanée, avec surlignage).
- **Filtres** par statut (Traité / En cours / Médico-légal) et par **catégorie**.
- **Formulaire d'ajout** : nom, catégorie, n° de dossier, référence, date, unité,
  statut, étiquettes et contenu libre. Le nom seul est obligatoire ; le reste
  est auto-complété si laissé vide.
- Chaque ajout est enregistré côté serveur → **visible par tout le monde**, sur tous les appareils.

---

## Déploiement sur Netlify (2 méthodes)

### Méthode A — Glisser-déposer (la plus simple)

1. Va sur https://app.netlify.com → **Add new site** → **Deploy manually**.
2. Glisse le **dossier `site-netlify` entier** dans la zone de dépôt.
3. Netlify détecte `netlify.toml`, installe `@netlify/blobs` et publie les fonctions.
4. Une fois en ligne, ouvre **une seule fois** l'URL suivante dans ton navigateur
   pour charger les dossiers existants :
   ```
   https://TON-SITE.netlify.app/api/seed
   ```
   (Tu dois voir `{"ok":true,"seeded":true,"count":11}`.)
5. Retourne sur la page d'accueil : les 11 dossiers sont là. Le bouton
   **« + Nouveau dossier »** fonctionne pour tout le monde.

### Méthode B — Via Git + Netlify CLI

```bash
# à la racine du dossier site-netlify
npm install
npx netlify deploy --prod
# puis, une seule fois :
curl https://TON-SITE.netlify.app/api/seed
```

---

## Comment fonctionne le partage entre visiteurs

- Le formulaire envoie le dossier à `/api/records` (fonction `records.mjs`).
- La fonction l'écrit dans un **store Netlify Blobs au niveau du site**
  (`getStore` avec `consistency: "strong"`), donc la donnée est **la même pour
  tous** et **persiste entre les déploiements**.
- À l'ouverture, le site lit `/api/records` et affiche la liste à jour.

Aucune clé d'API, aucune base de données externe : tout est géré par Netlify.

---

## Notes

- Node 18+ requis (fourni par défaut par Netlify).
- Pour repartir de zéro, tu peux vider le store depuis l'onglet **Blobs** de ton
  projet dans le tableau de bord Netlify, puis rappeler `/api/seed`.
- La suppression d'un dossier est disponible côté API
  (`DELETE /api/records?id=XXX`) si tu veux ajouter un bouton plus tard.
