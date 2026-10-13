export interface PRDChapter {
  id: string;
  number: string;
  title: string;
  summary: string;
  contentMarkdown: string;
  tags: string[];
}

export const PRD_METADATA = {
  title: "ArchEase - Cahier des Charges Technique & Fonctionnel (PRD)",
  version: "1.0.0-PROD-READY",
  status: "Validé pour Développement",
  author: "Chief Product Officer (CPO) & Lead Architecte SaaS BTP/3D",
  targetAudience: "Développeurs Full-Stack, Ingénieurs 3D/WebGL, Mobile AR, Designers UI/UX, Direction Produit",
  date: "Octobre 2026",
  confidentiality: "Interne & Partenaires Stratégiques",
};

export const PRD_CHAPTERS: PRDChapter[] = [
  {
    id: "chapitre-1",
    number: "1",
    title: "Contexte, Vision Produit & Cibles",
    summary: "Proposition de valeur, analyse des irritants marché, personas détaillés et objectifs stratégiques d'ArchEase.",
    tags: ["Vision", "Personas", "Valeur", "Canva de l'Architecture"],
    contentMarkdown: `
# 1. CONTEXTE & VISION PRODUIT

### 1.1 Identité du Projet
* **Nom officiel du produit :** **ArchEase**
* **Slogan de marque :** *"L'architecture et la gestion de chantier à la portée de tous."*
* **Baseline secondaire :** *Du premier croquis au dernier coup de pinceau, concevez et maîtrisez votre budget sans compétences techniques.*

---

### 1.2 Problématique Marché (Pain Points)
Le secteur de la conception de bâtiment et de la rénovation souffre d'une fracture technologique majeure :
1. **Outils d'architecture existants inadaptés :** Des logiciels comme AutoCAD, Revit ou SketchUp présentent une courbe d'apprentissage rédhibitoire (plusieurs dizaines d'heures de formation), des licences onéreuses et une complexité superflue pour 90% des projets résidentiels ou de petites entreprises.
2. **Déconnexion totale entre plan et devis (Le gouffre financier) :** Le particulier ou le petit artisan dessine un plan d'un côté, puis tente d'estimer les coûts sur un tableur Excel artisanal de l'autre. Résultat : 80% des chantiers dépassent le budget initial de 25% à 45% par oubli de chutes (carrelage), d'épaisseur de dalles ou d'accessoires.
3. **Absence de contextualisation environnementale :** Les novices ne savent pas orienter leurs baies vitrées par rapport au soleil, provoquant surchauffe estivale et pertes d'énergie.
4. **Hétérogénéité monétaire et régionale :** En Afrique de l'Ouest/Centrale (zone Franc CFA - XOF), en Europe (EUR) ou en Amérique du Nord (CAD/USD), le coût des matériaux et de la main-d'œuvre varie du simple au triple, sans outil unifié de conversion et d'indexation locale.

---

### 1.3 Proposition de Valeur : "Le Canva du BTP"
ArchEase démocratise l'architecture grâce à une approche inspirée de Canva :
* **Accessibilité Zéro Barrière :** Pas de calques complexes ni de manipulations de maillage 3D absconses. On assemble des pièces prédéfinies ou on trace des murs qui s'aimantent automatiquement.
* **Synchronisation Bidirectionnelle 2D / 3D :** Toute modification en 2D est instantanément répercutée dans le monde 3D extrudé et dans le métré financier.
* **Moteur de Métré Transparent (BOQ - Bill of Quantities) :** Chaque centimètre carré de mur ou de dalle génère une ligne de devis avec quantité réelle, coefficient de perte réglementaire et coût dans la devise locale choisie.
* **Du bureau au terrain :** Continuité de service entre le studio Web sur grand écran et l'application mobile de terrain (Réalité Augmentée 1:1, contrôle de chantier).

---

### 1.4 Cibles Prioritaires & Personas

#### Persona 1 : Marc (42 ans) – Auto-constructeur / Rénovateur novice
* **Profil :** Cadre ou entrepreneur hors BTP (ex: santé, commerce, pharmacie, exploitation agricole), lance l'agrandissement de sa maison ou la construction d'un bâtiment d'activité.
* **Pain Points :** Ne sait pas lire un plan technique d'architecte avec des cotes complexes ; angoisse de la facture finale imprévue ; difficultés à se projeter dans les volumes.
* **Besoins :** Vue 3D réaliste instantanée, estimation claire en devises locales (EUR ou FCFA), génération de devis compréhensible pour négocier avec les artisans.

#### Persona 2 : Youssef (36 ans) – Petit entrepreneur / Artisan BTP
* **Profil :** Gérant d'une entreprise de maçonnerie et rénovation de 4 salariés. Travaille sur le terrain, dispose de peu de temps le soir pour faire des devis.
* **Pain Points :** Passe des heures à mesurer au mètre ruban et à calculer le cubage de béton à la main sur un carnet ; oublie de facturer des chutes ou des finitions ; a du mal à faire signer ses clients sans visuel 3D.
* **Besoins :** Outil rapide pour générer un devis précis + rendu 3D propre à montrer sur tablette devant le client, liste d'achats de matériaux exacte.

---

### 1.5 Objectifs de Performance & KPIs
* **Time-to-first-plan :** Moins de 3 minutes pour qu'un utilisateur novice crée une pièce meublée cotée avec son estimation de coût.
* **Précision du métré :** Écart inférieur à 3% entre les quantités calculées par l'algorithme d'ArchEase et un métré professionnel certifié.
* **Fluidité d'affichage :** Maintien impératif de 60 FPS lors de la navigation 2D et de l'orbite 3D WebGL sur un ordinateur de bureau standard.
`
  },
  {
    id: "chapitre-2",
    number: "2",
    title: "Architecture Technique & Stack Recommandée",
    summary: "Architecture système complète : Frontend Web Canvas/WebGL, Mobile AR, Backend Node/Prisma, Offline-First et APIs.",
    tags: ["Next.js", "Konva.js", "Three.js", "Blueprint3D", "ARKit", "ARCore", "Prisma"],
    contentMarkdown: `
# 2. ARCHITECTURE TECHNIQUE & STACK RECOMMANDÉE

### 2.1 Vue d'Ensemble de l'Architecture (C4 Container Level)
ArchEase repose sur une architecture moderne découplée, optimisée pour le traitement graphique client-side et la synchronisation en temps réel :

\`\`\`text
+-----------------------------------------------------------------------------------+
|                              CLIENTS FRONTEND                                     |
|                                                                                   |
|  [ STUDIO WEB (Next.js / TypeScript) ]      [ MOBILE TERRAIN (React Native/Flutter) ]|
|  - Moteur 2D : Konva.js (Canvas 2D)         - Scanner LiDAR : iOS RoomPlan / ARKit  |
|  - Moteur 3D : Three.js / WebGL             - Projection 1:1 : ARCore / WebXR       |
|  - State : Zustand + Yjs (sync live)        - Mode Hors-Ligne : SQLite local       |
|  - Cache local : IndexedDB                  - Prise de photos géolocalisées         |
+-----------------------------------------------------------------------------------+
                                         │  HTTPS / WSS
                                         ▼
+-----------------------------------------------------------------------------------+
|                         BACKEND & API GATEWAY (Node.js)                           |
|                                                                                   |
|  - Fastify / Express TypeScript                                                   |
|  - Module Calcul Géométrique & Métré (Worker threads pour plans complexes)        |
|  - Service IA : OCR / Vision / Prompt-to-Layout (Gemini Multimodal API)           |
|  - Service Devises & Taux de change en temps réel (ExchangeRates API + Cache)     |
|  - Service Coûts Régionaux (Indexation City Cost Index)                           |
+-----------------------------------------------------------------------------------+
                                         │  Prisma ORM
                                         ▼
+-----------------------------------------------------------------------------------+
|                         PERSISTANCE & STOCKAGE DE DONNÉES                         |
|                                                                                   |
|  - PostgreSQL : Utilisateurs, Projets, Versions, Devises, Référentiels Prix       |
|  - Stockage Document (JSONB) : Graph de nœuds 2D/3D (Murs, Angles, Ouvertures)    |
|  - Object Storage (S3 / Cloud Storage) : Modèles GLTF/GLB, Textures PBR, Photos   |
+-----------------------------------------------------------------------------------+
\`\`\`

---

### 2.2 Choix Techniques & Justifications Détaillées

#### A. Frontend Web (Conception 2D/3D)
1. **Next.js (React 19) + TypeScript :**
   * *Justification :* Rendu ultra-rapide, écosystème de composants riche, typage strict des structures géométriques complexes.
2. **Moteur 2D Vectoriel : Konva.js (ou React-Konva) :**
   * *Justification :* Contrairement au DOM SVG qui s'effondre en performances au-delà de quelques centaines d'éléments manipulés, Konva.js utilise un rendu sur balise \`<canvas>\` multi-calques (calque de fond, calque de murs, calque d'aimantation/cotation, calque d'interaction). Permet le glisser-déposer fluide à 60 FPS, le snap-to-grid matriciel et la détection d'intersections par bounding-box polygonale.
3. **Moteur 3D Temps Réel : Three.js / WebGL (Pattern Blueprint3D) :**
   * *Justification :* Génération dynamique de maillages (*procedural mesh generation*) : à partir des coordonnées 2D des murs, le système génère en direct les géométries 3D extrudées (\`ExtrudeGeometry\`), découpe les ouvertures de fenêtres et de portes par opérations booléennes CSG (*Constructive Solid Geometry*), et applique les textures PBR (brique, béton lisse, crépi, carrelage, parquet).
   * *Architecture Blueprint3D :* Structure en graphe de pièces (*Half-Edge Data Structure*) où chaque mur est un segment délimité par deux nœuds (*Corners*), permettant de recalculer instantanément les pièces closes et leurs surfaces.

#### B. Application Mobile (Terrain & Réalité Augmentée)
1. **React Native (avec ponts natifs) ou Flutter :**
   * *Justification :* Codebase unique pour les écrans de gestion de chantier, tout en intégrant des modules natifs haute performance pour la Réalité Augmentée.
2. **Module AR iOS : ARKit 6 + Apple RoomPlan (LiDAR) :**
   * *Justification :* RoomPlan permet une capture automatique des pièces en quelques secondes (murs, portes, fenêtres, cotes réelles) exportée directement en format USDZ ou JSON standard compatible avec le studio ArchEase.
3. **Module AR Android : ARCore + WebXR / \`<model-viewer>\` :**
   * *Justification :* Ancrage du modèle 3D à l'échelle 1:1 sur le terrain naturel grâce à la détection de plans horizontaux et l'estimation de la lumière ambiante.

#### C. Backend & Base de Données
1. **Node.js (TypeScript) & Prisma ORM :**
   * *Justification :* Typage de bout en bout (*End-to-End Type Safety*) entre le client Web et la base de données.
2. **PostgreSQL avec extensions géométriques & JSONB :**
   * *Justification :* Stockage relationnel pour la gestion des utilisateurs, des droits et du catalogue de prix, combiné au stockage JSONB optimisé pour le graphe de plan (arborescence des murs, meubles et matériaux).
3. **Mode Hors-Ligne (Offline-First) :**
   * *Justification :* Sur un chantier ou une exploitation agricole en zone blanche, l'accès réseau est souvent dégradé. Les modifications sont enregistrées dans l'**IndexedDB** du navigateur ou le **SQLite** mobile, puis réconciliées via un algorithme CRDT (*Conflict-free Replicated Data Types*) dès le retour de la connexion.

#### D. Intégrations & APIs Tierces
* **API Taux de Change :** Mise à jour quotidienne des cours de conversion pour les devises clés (EUR, USD, XOF, CAD, GBP, MAD).
* **Référentiel de Prix & City Cost Index (CCI) :** Grille paramétrique permettant d'ajuster le coût de la main-d'œuvre et des matières premières selon l'emplacement géographique du chantier.
`
  },
  {
    id: "chapitre-3",
    number: "3",
    title: "Spécifications Fonctionnelles Détaillées (Modules A à E)",
    summary: "Règles métier, algorithmes de métré automatique, formules mathématiques, simulation solaire et modules AR.",
    tags: ["Module A", "Module B", "Module C", "Module D", "Module E", "Métré BOQ", "Solaire"],
    contentMarkdown: `
# 3. SPÉCIFICATIONS FONCTIONNELLES DÉTAILLÉES

---

## 3.1 Module A : Studio Web de Conception 2D/3D (Mode Canva & IA)

### 3.1.1 Mode 2D "Drag & Drop" & Tracé Intelligent
* **Catalogue de Pièces Pré-dimensionnées :**
  L'utilisateur peut faire glisser sur la grille des pièces prêtes à l'emploi (Salon 25m², Chambre 12m², Cuisine 10m², Salle d'eau 5m², Espace Stockage Agricole 30m², Officine 28m²). Les murs se fusionnent automatiquement lorsqu'ils entrent en contact.
* **Tracé de Murs Libres :**
  * Accrochage automatique (*Snap-to-Grid*) avec pas paramétrable (10 cm, 25 cm, 50 cm).
  * Alignement angulaire automatique (angles droits 90°, 45° ou libres).
  * Cotations dynamiques en temps réel affichées en mètres avec 2 décimales.
  * Définition de l'épaisseur du mur (20 cm pour mur porteur / extérieur, 10 cm pour cloison de doublage ou séparation).
* **Ouvertures & Équipements :**
  * Glisser-déposer de portes simples, portes doubles, fenêtres standard, baies vitrées coulissantes.
  * L'insertion d'une ouverture découpe automatiquement le mur hôte sans intervention manuelle.
  * Sens d'ouverture de porte paramétrable (vers l'intérieur / l'extérieur, gauche / droite).

### 3.1.2 Mode 3D Temps Réel & Extrusion Procédurale
* **Bascule Instantanée 2D ⇄ 3D :**
  * Aucune étape d'exportation ou d'attente de rendu. La bascule se fait en moins de 100 ms via un toggle d'interface.
* **Rendu des Matériaux PBR :**
  * Sols : Carrelage grès cérame, parquet bois massif, béton ciré, chape brute, dalle extérieure.
  * Murs : Enduit crépi blanc, briques rouges, peinture lisse satinée, bardage bois, parpaings apparents.
  * Toitures : Toit plat avec acrotère (terrasse accessible ou non), toiture 2 pans, toiture bac acier.
* **Modes de Caméra :**
  * *Caméra Orbite (Vue Axonométrique / Aérienne) :* Rotation 360°, zoom molette, inclinaison.
  * *Caméra Visite 1ère Personne (First-Person Walkthrough) :* Déplacement aux touches ZQSD/Flèches à hauteur d'yeux (1,70 m) pour éprouver les volumes.

### 3.1.3 Assistant IA : Du Croquis au Plan 3D
* **Image-to-Vector (Scanner de Croquis) :**
  * L'utilisateur prend en photo un croquis dessiné sur papier ou un plan papier existant.
  * Le pipeline de vision (Vision Multimodale) détecte les lignes fermées (murs), les ouvertures (portes/fenêtres) et les mentions textuelles (cotes, désignation des pièces).
  * Reconstruction vectorielle dans le studio ArchEase en tant que plan éditable.
* **Prompt-to-Layout (Génération d'Agencement) :**
  * Commande en langage naturel : *"Crée une villa de 95m² avec 3 chambres dont une suite parentale, un grand salon orienté sud avec cuisine ouverte et une buanderie."*
  * Le modèle génère une configuration spatiale optimale respectant les contraintes ergonomiques du bâtiment (circulations, surfaces minimales habitables).

---

## 3.2 Module B : Environnement, Terrain & Ensoleillement

### 3.2.1 Modélisation de la Parcelle
* Définition des limites de propriété (parcelle cadastrale rectangulaire ou polygonale).
* Gestion du relief simplifié : Déclivité et pente du terrain (en %) avec calcul des remblais/déblais indicatifs.

### 3.2.2 Simulateur de Course Solaire Dynamique
* **Calcul Astronomique en Temps Réel :**
  * Entrées : Latitude, Longitude, Date (jour de l'année) et Heure de la journée (curseur de 06:00 à 20:00).
  * Formules trigonométriques pour déterminer l'Azimut (angle d'orientation) et la Hauteur angulaire du Soleil :
    $$\\sin(\\alpha) = \\sin(\\phi) \\cdot \\sin(\\delta) + \\cos(\\phi) \\cdot \\cos(\\delta) \\cdot \\cos(H)$$
  * Projection dynamique des ombres portées sur les façades et les pièces intérieures selon l'orientation Nord sélectionnée.
* **Indicateur d'Efficacité Bioclimatique :**
  * Détection automatique des pièces orientées Sud (apports solaires passifs optimaux en hiver) et Ouest (risque de surchauffe estivale).

---

## 3.3 Module C : Moteur d'Estimation Budgétaire & Métré (BOQ)

Le cœur de la proposition de valeur réside dans le calcul automatique et sans faille du **Bordereau des Prix Quantitatifs (Bill of Quantities)**.

### 3.3.1 Algorithmes et Formules Mathématiques du Métré

#### A. Gros Œuvre & Structure
1. **Volume de Béton des Fondations & Dalle ($V_{beton}$ en m³) :**
   $$V_{dalle} = S_{emprise} \\times e_{dalle} \\quad (\\text{où } e_{dalle} = 0.15\\text{ m par défaut})$$
   $$V_{fondations} = L_{murs\\_porteurs} \\times l_{semelle} \\times h_{semelle} \\quad (\\text{ex: } 0.50\\text{ m} \\times 0.40\\text{ m})$$
   $$V_{total\\_beton} = V_{dalle} + V_{fondations}$$
2. **Surface Nette des Murs Extérieurs & Cloisons ($S_{nette}$ en m²) :**
   $$S_{brute} = \\sum (L_{mur} \\times H_{mur})$$
   $$S_{baies} = \\sum (L_{ouverture} \\times H_{ouverture})$$
   $$S_{nette} = S_{brute} - S_{baies}$$
3. **Surface Développée de Toiture ($S_{toiture}$ en m²) :**
   Pour une toiture en pente à angle $\\theta$ :
   $$S_{toiture} = \\frac{S_{emprise}}{\\cos(\\theta)} \\times (1 + \\text{débord})$$

#### B. Second Œuvre & Finitions
1. **Revêtement de Sol (Carrelage / Parquet) :**
   $$S_{carrelage\\_commande} = S_{interieure\\_nette} \\times 1.10$$
   *Règle métier impérative :* Application automatique d'une **marge de 10% pour les chutes de découpe et l'alignement des joints** (15% pour pose en diagonale).
2. **Métré Peinture Intérieure :**
   $$S_{peinture} = (S_{nette\\_murs\\_interieurs} + S_{plafond}) \\times 2 \\text{ couches}$$
3. **Menuiseries et Équipements :**
   * Décompte exact unitaire ($u$) : nombre de blocs-portes, fenêtres, portes-fenêtres, prises de courant et arrivées d'eau par pièce.

### 3.3.2 Base de Prix & Régionalisation (City Cost Index - CCI)
Chaque coût unitaire ($P_{base}$) est modulé selon la formule :
$$P_{local} = P_{base} \\times CCI_{region} \\times \\left(\\frac{Taux_{main\\_oeuvre\\_local}}{Taux_{main\\_oeuvre\\_ref}}\\right)$$

### 3.3.3 Conversion Multi-Devises Instantanée
Support natif et conversion instantanée en un clic entre :
* **EUR (€) :** Monnaie de référence européenne.
* **XOF / Franc CFA (FCFA) :** Monnaie essentielle pour l'Afrique de l'Ouest (Sénégal, Côte d'Ivoire, Mali, etc., parité fixe 1 EUR = 655,957 XOF).
* **USD ($), CAD ($), GBP (£), MAD (DH).**
L'export PDF du devis se fait directement dans la devise sélectionnée avec ventilation main-d'œuvre / matériaux / taxes.

---

## 3.4 Module D : Planificateur de Chantier A à Z

### 3.4.1 Chronologie Dynamique par Corps d'État (Gantt Simplifié)
Découpage chronologique automatique selon le volume du projet :
1. **Phase 1 : Démarches & Préparations** (Permis de construire, bornage, viabilisation).
2. **Phase 2 : Fondations & Terrassement** (Fouille, ferraillage, coulage dalle).
3. **Phase 3 : Gros Œuvre & Maçonnerie** (Élévation des murs, chaînages, linteaux).
4. **Phase 4 : Hors d'Eau / Hors d'Air** (Charpente, couverture, menuiseries extérieures).
5. **Phase 5 : Second Œuvre** (Plomberie, électricité, cloisons, isolation).
6. **Phase 6 : Finitions & Réception** (Carrelage, peinture, sanitaires, remise des clés).

### 3.4.2 Alertes de Dépassement Budgétaire
* Indicateur visuel d'avancement physique vs consommation financière.
* Système d'alerte en cas d'écart supérieur à 10% entre devis estimé et dépenses réelles constatées.

---

## 3.5 Module E : Application Mobile AR & Terrain

### 3.5.1 Visualisation en Réalité Augmentée 1:1
* Ancrage du modèle 3D conçu sur le studio directement sur la parcelle réelle.
* L'utilisateur se promène physiquement avec son smartphone : les murs virtuels se superposent à l'environnement réel pour valider les perspectives et la vue.

### 3.5.2 Journal de Chantier Géolocalisé
* Prise de photos associées à chaque étape du planning.
* Horodatage certifié et coordonnées GPS pour historique des travaux et communication avec les banques ou assurances.
`
  },
  {
    id: "chapitre-4",
    number: "4",
    title: "Structure de Base de Données (Schéma Prisma & Modèle JSON)",
    summary: "Schéma relationnel complet PostgreSQL (Prisma ORM) et spécification JSON du graphe 2D/3D.",
    tags: ["PostgreSQL", "Prisma ORM", "JSON Graph", "Schema BDD", "BOQItem"],
    contentMarkdown: `
# 4. STRUCTURE DE BASE DE DONNÉES (ÉBAUCHE SCHEMA)

### 4.1 Schéma Relationnel Prisma (PostgreSQL)

\`\`\`prisma
// datasource and generator
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  USER_NOVICE
  ARTISAN_PRO
  ADMIN
}

enum ProjectType {
  RESIDENTIAL_HOUSE
  APARTMENT_RENOVATION
  COMMERCIAL_PHARMACY
  AGRICULTURAL_BUILDING
}

enum CurrencyCode {
  EUR
  USD
  XOF
  CAD
  GBP
  MAD
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  COMPLETED
  DELAYED
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  fullName      String
  role          Role      @default(USER_NOVICE)
  companyName   String?
  country       String    @default("FR")
  preferredCurrency CurrencyCode @default(EUR)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  projects      Project[]
  priceLists    PriceReference[]
}

model Project {
  id              String       @id @default(uuid())
  userId          String
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  title           String
  description     String?
  type            ProjectType  @default(RESIDENTIAL_HOUSE)
  currency        CurrencyCode @default(EUR)
  cityCostIndexId String       @default("fr_province")
  
  // Paramètres environnement & terrain
  terrainWidth    Float        @default(20.0) // mètres
  terrainLength   Float        @default(30.0) // mètres
  northAngleDeg   Float        @default(0.0)  // 0-360 degrés
  latitude        Float?
  longitude       Float?

  // Données de conception (Graph 2D/3D complet)
  floorplanData   Json         // Structure JSON Graph (Corners, Walls, Rooms, Openings)

  totalEstimatedCost Float     @default(0.0)
  totalAreaM2        Float     @default(0.0)

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  boqItems        BOQItem[]
  scheduleTasks   ScheduleTask[]
  sitePhotos      SitePhoto[]
}

model Material {
  id            String       @id @default(uuid())
  code          String       @unique // ex: "BETON_C25_30", "PARPAING_20", "CARRELAGE_GRES"
  name          String
  category      String       // GROS_OEUVRE, SECOND_OEUVRE, FINITIONS
  unit          String       // m3, m2, ml, u, kg
  defaultUnitPriceEUR Float
  description   String?
  densityKgM3   Float?

  boqItems      BOQItem[]
}

model BOQItem {
  id             String    @id @default(uuid())
  projectId      String
  project        Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  materialId     String?
  material       Material? @relation(fields: [materialId], references: [id])
  
  category       String
  designation    String
  unit           String
  grossQuantity  Float
  wasteMarginPct Float     @default(0.0) // 10% pour carrelage
  netQuantity    Float
  unitPriceEUR   Float
  totalPriceEUR  Float
  formulaUsed    String    // Traçabilité de l'algorithme mathématique

  createdAt      DateTime  @default(now())
}

model ScheduleTask {
  id             String     @id @default(uuid())
  projectId      String
  project        Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  phase          String     // FONDATIONS, GROS_OEUVRE, etc.
  title          String
  orderIndex     Int
  durationDays   Int
  progressPct    Int        @default(0)
  status         TaskStatus @default(TODO)
  estimatedCostEUR Float    @default(0.0)
  actualCostEUR    Float    @default(0.0)
  startDate      DateTime?
  endDate        DateTime?
}

model SitePhoto {
  id             String    @id @default(uuid())
  projectId      String
  project        Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  imageUrl       String
  caption        String?
  latitude       Float?
  longitude      Float?
  takenAt        DateTime  @default(now())
}

model PriceReference {
  id             String    @id @default(uuid())
  userId         String?   // Null si prix catalogue public par défaut
  user           User?     @relation(fields: [userId], references: [id])
  regionCode     String    // ex: "paris", "abidjan", "dakar"
  itemCode       String
  priceValue     Float
  currency       CurrencyCode
}
\`\`\`

---

### 4.2 Spécification du Graphe de Plan JSON (Floorplan Graph)
Le champ \`floorplanData\` est modélisé sous la forme d'un graphe planaire direct, permettant l'extrusion 3D sans perte d'information :

\`\`\`json
{
  "version": "1.0",
  "units": "meters",
  "corners": [
    { "id": "c1", "x": 0.0, "y": 0.0 },
    { "id": "c2", "x": 8.0, "y": 0.0 },
    { "id": "c3", "x": 8.0, "y": 6.0 },
    { "id": "c4", "x": 0.0, "y": 6.0 }
  ],
  "walls": [
    {
      "id": "w1",
      "cornerStart": "c1",
      "cornerEnd": "c2",
      "thickness": 0.20,
      "height": 2.60,
      "isExterior": true,
      "material": "crepi_blanc"
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "name": "Espace Principal",
      "cornerIds": ["c1", "c2", "c3", "c4"],
      "floorAreaM2": 48.0,
      "floorMaterial": "carrelage_gres_60x60",
      "ceilingHeight": 2.60
    }
  ],
  "openings": [
    {
      "id": "op1",
      "wallId": "w1",
      "type": "bay_window",
      "xOffset": 2.5,
      "width": 2.40,
      "height": 2.15,
      "sillHeight": 0.0
    }
  ]
}
\`\`\`
`
  },
  {
    id: "chapitre-5",
    number: "5",
    title: "Découpage MVP & Feuille de Route (Roadmap)",
    summary: "Planification des releases V1 MVP, V2 Pro & IA, V3 Chantier Collaboratif & Matrice MoSCoW.",
    tags: ["Roadmap", "MVP", "MoSCoW", "Budget", "Livraison"],
    contentMarkdown: `
# 5. DÉCOUPAGE MVP & FEUILLE DE ROUTE (ROADMAP)

### 5.1 Stratégie de Phasage & Découpage des Livraisons

\`\`\`text
+-----------------------+     +-----------------------+     +-----------------------+
|     PHASE 1 (MVP)     |     |     PHASE 2 (V2)      |     |     PHASE 3 (V3)      |
|  "Le Coeur Métier"    | ──> |  "IA & Immersion AR"  | ──> |  "Collaboration Pro"  |
|  Durée : 3 mois       |     |  Durée : 3 mois       |     |  Durée : 4 mois       |
+-----------------------+     +-----------------------+     +-----------------------+
- Éditeur 2D/3D Canvas/WebGL   - Scanner croquis IA          - Multi-utilisateurs live
- Bibliothèque 20 pièces      - Prompt-to-Layout IA         - Portail Artisan/Client
- Moteur BOQ instantané        - App Mobile AR 1:1 (LiDAR)   - Signature devis en ligne
- Taux multi-devises (EUR/XOF) - Course du soleil dynamique  - Suivi de chantier GPS
- Export PDF Devis & Cotes     - Mode Offline local poussé   - Intégration comptable
\`\`\`

---

### 5.2 Détail des Phases

#### Phase 1 : MVP (Minimum Viable Product) – 3 Mois
* **Objectif :** Permettre à un particulier ou artisan de dessiner une maison simple, de basculer en 3D, de voir le prix exact dans sa devise et de générer un devis PDF complet.
* **Livrables :**
  1. Éditeur 2D vectoriel (tracé de murs, cotes automatiques, portes et fenêtres).
  2. Visualiseur 3D WebGL temps réel avec textures de base.
  3. Moteur de calcul du métré (béton m³, murs m², carrelage +10% chutes, peinture).
  4. Sélecteur de devises (EUR, USD, XOF, CAD, GBP, MAD) et City Cost Index de base.
  5. Module d'exportation PDF avec devis récapitulatif détaillé.

#### Phase 2 : Version V2 (IA & Réalité Augmentée) – 3 Mois
* **Objectif :** Supprimer la friction du dessin initial et projeter le bâtiment dans le monde réel.
* **Livrables :**
  1. Module IA Scanner de croquis papier vers plan 3D vectoriel.
  2. Module IA "Prompt-to-Layout" générant un aménagement sur consigne textuelle.
  3. Application Mobile AR (iOS RoomPlan LiDAR + Android ARCore) pour projection 1:1 sur la parcelle.
  4. Simulation horaire de l'ensoleillement et des ombres portées.

#### Phase 3 : Version V3 (Écosystème BTP & Collaboratif) – 4 Mois
* **Objectif :** Transformer ArchEase en plateforme transactionnelle reliant clients et artisans.
* **Livrables :**
  1. Mode multi-utilisateurs en temps réel (comme Figma/Canva) pour co-concevoir un projet.
  2. Journal de bord et planning de chantier complet avec photos horodatées géolocalisées.
  3. Marketplace de matériaux locaux et mise en relation directe avec artisans partenaires qualifiés.

---

### 5.3 Matrice de Priorisation des Exigences (MoSCoW)

| Priorité | Fonctionnalités / Modules | Justification Produit |
| :--- | :--- | :--- |
| **MUST HAVE** (Obligatoire V1) | • Tracé 2D avec cotations automatiques<br>• Extrusion 3D temps réel<br>• Calcul automatique cubage béton, murs et carrelage (+10%)<br>• Multi-devises (EUR / XOF Franc CFA / USD / CAD)<br>• Export PDF du devis | Cœur de la promesse de valeur : clarté architecturale et transparence budgétaire. |
| **SHOULD HAVE** (Recommandé V1.5) | • Simulation de la course du soleil<br>• Catalogue mobilier pré-configuré<br>• Ajustement City Cost Index<br>• Mode hors-ligne local (IndexedDB) | Évite les erreurs d'orientation et permet de travailler sur chantier sans réseau. |
| **COULD HAVE** (Optionnel V2) | • Scanner de croquis IA (Image to 3D)<br>• Projection AR 1:1 sur mobile<br>• Générateur de plans textuel (Prompt-to-Layout) | Démultiplicateur d'attractivité marketing et de gain de temps. |
| **WON'T HAVE** (Exclu du MVP) | • Calcul de structure sismique / Eurocodes complexes<br>• Passerelle directe ERP BTP lourds (SAP/BIM IFC niveau 3)<br>• Commande en ligne directe de bétonnière | Complexité inutile pour la cible novices et petits artisans. |

---

### 5.4 Recommandation d'Équipe & Gouvernance
Pour mener à bien le développement de la V1 et V2 :
* **1 Product Manager / CPO :** Arbitrage des fonctionnalités, validation des parcours utilisateurs novices et artisans.
* **1 Lead Architecte Full-Stack / 3D :** Garant des performances WebGL/Canvas et de la précision des algorithmes de métré.
* **2 Développeurs Frontend Senior :** Spécialistes React, Canvas 2D (Konva.js) et Three.js.
* **1 Développeur Mobile AR :** Intégration ARKit RoomPlan & ARCore.
* **1 Développeur Backend / BDD :** APIs, Prisma, PostgreSQL et intégrations financières.
`
  }
];
