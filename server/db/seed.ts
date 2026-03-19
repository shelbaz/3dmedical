import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";

const client = postgres(process.env.DATABASE_URL!, { ssl: "require" });
const db = drizzle(client, { schema });

type NewStructure = typeof schema.anatomicalStructure.$inferInsert;

async function seed() {
  console.log("Clearing existing data...");
  await db.delete(schema.spaceBorder);
  await db.delete(schema.structureRelation);
  await db.delete(schema.userAnnotation);
  await db.delete(schema.userProgress);
  await db.delete(schema.anatomicalStructure);

  console.log("Seeding anatomical structures...");

  const structures: NewStructure[] = [
    // ─── SKELETAL ───────────────────────────────────────
    {
      name: "Pelvic Ring (Os Coxae)",
      latinName: "Os coxae",
      system: "skeletal",
      region: "pelvis",
      meshName: "Pelvic Ring (Os Coxae)",
      description:
        "The bony pelvis formed by the two hip bones (os coxae), sacrum, and coccyx. Each os coxae consists of the fused ilium, ischium, and pubis. The pelvic ring defines the pelvic inlet (conjugate, transverse, and oblique diameters) and outlet.",
      clinicalSignificance:
        "Pelvic dimensions are assessed for adequacy in obstetrics. Fractures of the pelvic ring can cause life-threatening hemorrhage from disruption of the presacral venous plexus and internal iliac vessel branches. Key landmarks include the ischial spines (narrowest transverse diameter), sacral promontory, and pubic symphysis.",
    },
    {
      name: "Sacrum",
      latinName: "Os sacrum",
      system: "skeletal",
      region: "pelvis",
      meshName: "Sacrum",
      description:
        "Triangular bone at the base of the spine formed by fusion of five sacral vertebrae (S1-S5). The sacral promontory (anterior S1) is a key obstetric landmark. Anterior sacral foramina transmit ventral rami of sacral spinal nerves. The sacral hiatus is the opening at the caudal end.",
      clinicalSignificance:
        "The anterior surface is closely related to the presacral venous plexus — injury during rectal mobilization or sacrocolpopexy causes life-threatening hemorrhage. The sacral promontory is the fixation point for sacrocolpopexy mesh. Sacral nerve roots S2-S4 provide parasympathetic innervation to pelvic viscera.",
    },
    {
      name: "Pubic Symphysis",
      latinName: "Symphysis pubica",
      system: "skeletal",
      region: "pelvis",
      meshName: "Pubic Symphysis",
      description:
        "Secondary cartilaginous joint between the two pubic bones. Contains a fibrocartilaginous interpubic disc. Normally allows minimal movement (<2mm).",
      clinicalSignificance:
        "Landmark for retropubic procedures (TVT sling, Burch colposuspension). Pubic symphysis diastasis can occur during delivery. The superior pubic ramus carries the corona mortis (aberrant obturator vessels) — a critical variant to be aware of during anterior pelvic surgery.",
    },

    // ─── MUSCULAR ───────────────────────────────────────
    {
      name: "Levator Ani",
      latinName: "Musculus levator ani",
      system: "muscular",
      region: "pelvic_floor",
      meshName: "Levator Ani",
      description:
        "The primary muscle of the pelvic floor, forming a broad muscular sheet (the pelvic diaphragm). Composed of three parts: pubococcygeus (with subdivisions pubovaginalis, puboperinealis, puboanalis), puborectalis, and iliococcygeus. Origin: inner pubis and arcus tendineus levator ani (ATLA). Insertion: anococcygeal raphe, coccyx, and pelvic organs.",
      clinicalSignificance:
        "The levator hiatus (urogenital hiatus) is the gap through which the urethra, vagina, and rectum pass — the primary site of weakness in pelvic organ prolapse. Avulsion of the pubovisceral muscle from the pubic bone is seen in up to 36% of vaginal deliveries and is a major risk factor for prolapse. The levator plate (iliococcygeus) provides a horizontal shelf supporting the pelvic organs.",
    },
    {
      name: "Obturator Internus",
      latinName: "Musculus obturatorius internus",
      system: "muscular",
      region: "pelvic_wall",
      meshName: "Obturator Internus",
      description:
        "Pelvic wall muscle originating from the pelvic surface of the obturator membrane and surrounding bone. Exits through the lesser sciatic foramen to insert on the greater trochanter. Its fascia is critically important: gives rise to the arcus tendineus levator ani (ATLA) and the arcus tendineus fasciae pelvis (ATFP / white line), and forms the lateral wall of the ischioanal fossa.",
      clinicalSignificance:
        "The obturator internus fascia forms the pudendal (Alcock's) canal on its medial surface, containing the pudendal nerve and internal pudendal vessels. The ATFP (white line) is the lateral attachment of the pubocervical fascia — paravaginal defect repair reattaches the vagina to this structure.",
    },
    {
      name: "Obturator Internus (R)",
      latinName: "Musculus obturatorius internus (dexter)",
      system: "muscular",
      region: "pelvic_wall",
      meshName: "Obturator Internus (R)",
      description: "Right obturator internus muscle. See left side for full description.",
      clinicalSignificance: "Same clinical significance as left side.",
    },
    {
      name: "Piriformis",
      latinName: "Musculus piriformis",
      system: "muscular",
      region: "pelvic_wall",
      meshName: "Piriformis",
      description:
        "Posterior pelvic wall muscle. Origin: anterior surface of sacrum (S2-S4) and sacrotuberous ligament. Exits through the greater sciatic foramen to insert on the superior border of the greater trochanter. Divides the greater sciatic foramen into suprapiriform and infrapiriform spaces.",
      clinicalSignificance:
        "The sciatic nerve typically exits INFERIOR to the piriformis (infrapiriform space) — in ~12% of people the nerve or its divisions pierce through or pass above the muscle (piriformis syndrome). The superior gluteal nerve and vessels pass ABOVE the piriformis (suprapiriform). The pudendal nerve, internal pudendal vessels, and inferior gluteal nerve exit below it.",
    },
    {
      name: "Bulbospongiosus",
      latinName: "Musculus bulbospongiosus",
      system: "muscular",
      region: "perineum",
      description:
        "Superficial perineal muscle. Origin: perineal body. Surrounds the vaginal orifice and inserts into the perineal membrane and corpora cavernosa of the clitoris. Innervation: perineal branch of pudendal nerve (S2-S4).",
      clinicalSignificance:
        "Constricts vaginal orifice, compresses bulb of vestibule (aiding engorgement), compresses deep dorsal vein of clitoris. The Martius flap (labial fat pad flap) used in fistula repair is harvested from the bulbospongiosus fat pad.",
    },
    {
      name: "External Anal Sphincter",
      latinName: "Musculus sphincter ani externus",
      system: "muscular",
      region: "perineum",
      description:
        "Voluntary skeletal muscle sphincter surrounding the anal canal. Three parts: subcutaneous, superficial (perineal body to anococcygeal ligament), and deep (blends with puborectalis). Innervation: inferior rectal nerve (branch of pudendal nerve, S2-S4).",
      clinicalSignificance:
        "Third and fourth degree perineal tears involve the external anal sphincter. Repair is critical for fecal continence. The intersphincteric plane (between internal and external sphincters) is the surgical plane for intersphincteric resection of low rectal cancer.",
    },
    {
      name: "External Urethral Sphincter",
      latinName: "Musculus sphincter urethrae externus",
      system: "muscular",
      region: "perineum",
      description:
        "Voluntary striated muscle complex surrounding the membranous urethra. In females, composed of sphincter urethrae, compressor urethrae, and urethrovaginal sphincter. Innervation: perineal branch of pudendal nerve (S2-S4).",
      clinicalSignificance:
        "Primary mechanism of voluntary urinary continence. Denervation (pudendal neuropathy from childbirth) contributes to stress urinary incontinence. Mid-urethral sling procedures (TVT, TOT) provide a backboard of support under this sphincter.",
    },

    // ─── ARTERIAL ───────────────────────────────────────
    {
      name: "Internal Iliac Artery (L)",
      latinName: "Arteria iliaca interna (sinistra)",
      system: "arterial",
      region: "pelvis",
      meshName: "Internal Iliac Artery (L)",
      description:
        "Main arterial supply to the pelvis. Arises from bifurcation of common iliac artery at the pelvic brim (sacroiliac joint level). Divides into anterior and posterior divisions. Posterior division: iliolumbar, lateral sacral, superior gluteal arteries. Anterior division: umbilical/superior vesical, uterine, vaginal, middle rectal, obturator, internal pudendal, inferior gluteal arteries.",
      clinicalSignificance:
        "Ligation of the anterior division is a life-saving maneuver for intractable pelvic hemorrhage (postpartum, surgical, trauma). Reduces pulse pressure by 85% distally, converting arterial flow to venous-type flow to promote clotting. Bilateral internal iliac artery ligation is well-tolerated due to extensive collateral circulation.",
    },
    {
      name: "Internal Iliac Artery (R)",
      latinName: "Arteria iliaca interna (dextra)",
      system: "arterial",
      region: "pelvis",
      meshName: "Internal Iliac Artery (R)",
      description: "Right internal iliac artery. See left side for full description.",
      clinicalSignificance: "Same clinical significance as left side.",
    },
    {
      name: "Uterine Artery",
      latinName: "Arteria uterina",
      system: "arterial",
      region: "pelvis",
      meshName: "Uterine Artery",
      description:
        "Branch of the anterior division of the internal iliac artery. Courses medially in the base of the broad ligament (cardinal ligament), crosses the ureter SUPERIORLY approximately 1-2 cm lateral to the cervix ('water under the bridge'). Gives ascending branch (supplies uterine body, anastomoses with ovarian artery at fundus) and descending cervicovaginal branch.",
      clinicalSignificance:
        "The relationship to the ureter is the most important surgical landmark in gynecology. During hysterectomy, the uterine artery must be ligated while preserving the ureter. Uterine artery embolization (UAE) is used to treat fibroids. The ascending branch forms arcuate arteries → radial arteries → spiral arteries in the endometrium.",
    },
    {
      name: "Internal Pudendal Artery",
      latinName: "Arteria pudenda interna",
      system: "arterial",
      region: "perineum",
      meshName: "Internal Pudendal Artery",
      description:
        "Terminal branch of the anterior division of the internal iliac artery. Exits the greater sciatic foramen below piriformis, hooks around the ischial spine (posterior to sacrospinous ligament), enters the lesser sciatic foramen, and travels in Alcock's canal (pudendal canal) on the medial surface of obturator internus.",
      clinicalSignificance:
        "Branches: inferior rectal artery, perineal artery, artery of the bulb of vestibule, deep artery of clitoris, dorsal artery of clitoris. Main arterial supply to the perineum and external genitalia. Can be injured during sacrospinous ligament fixation. The artery of the bulb is at risk during posterior vaginal wall surgery.",
    },
    {
      name: "Ovarian Artery",
      latinName: "Arteria ovarica",
      system: "arterial",
      region: "pelvis",
      description:
        "Direct branch of the abdominal aorta at L2 level. Descends retroperitoneally, crosses the pelvic brim, and enters the suspensory ligament (infundibulopelvic ligament) of the ovary. Gives ovarian, tubal, and ureteric branches. Anastomoses with ascending branch of the uterine artery in the mesosalpinx.",
      clinicalSignificance:
        "Must be ligated within the infundibulopelvic ligament during oophorectomy — the ureter crosses beneath this ligament at the pelvic brim and is at risk. The ovarian-uterine anastomosis provides collateral supply to the uterus after uterine artery ligation.",
    },
    {
      name: "Superior Rectal Artery",
      latinName: "Arteria rectalis superior",
      system: "arterial",
      region: "pelvis",
      description:
        "Terminal branch of the inferior mesenteric artery. Supplies the upper rectum. Divides into right and left branches that descend in the mesorectum.",
      clinicalSignificance:
        "Ligated at the inferior mesenteric artery origin during high ligation in rectal cancer surgery. The mesorectal dissection plane preserves this artery within the mesorectum for total mesorectal excision (TME).",
    },
    {
      name: "Corona Mortis",
      latinName: "Corona mortis",
      system: "arterial",
      region: "pelvis",
      description:
        "Aberrant anastomotic vessel between the obturator system and the external iliac/inferior epigastric system, crossing behind the superior pubic ramus (40-96mm from symphysis). Arterial variant present in ~25%, venous in ~42%, any type in up to 80-91% of females.",
      clinicalSignificance:
        "'Crown of death' — severe hemorrhage if injured during pelvic fracture fixation, hernia repair, TVT sling placement, or pelvic lymphadenectomy. Must be identified and preserved or ligated during any anterior pelvic procedure near the superior pubic ramus.",
    },

    // ─── VENOUS ─────────────────────────────────────────
    {
      name: "Internal Iliac Vein (L)",
      latinName: "Vena iliaca interna (sinistra)",
      system: "venous",
      region: "pelvis",
      meshName: "Internal Iliac Vein (L)",
      description:
        "Main venous drainage of the pelvis. Tributaries generally mirror arterial branches: superior/inferior gluteal veins, obturator vein, lateral sacral veins, internal pudendal vein, middle rectal veins. Receives drainage from multiple pelvic venous plexuses.",
      clinicalSignificance:
        "Short, thin-walled, and partially hidden behind the artery — difficult to control when injured. Venous injury during pelvic lymphadenectomy or sacral dissection is a feared complication.",
    },
    {
      name: "Internal Iliac Vein (R)",
      latinName: "Vena iliaca interna (dextra)",
      system: "venous",
      region: "pelvis",
      meshName: "Internal Iliac Vein (R)",
      description: "Right internal iliac vein.",
      clinicalSignificance: "Same clinical significance as left side.",
    },
    {
      name: "Uterine Venous Plexus",
      latinName: "Plexus venosus uterinus",
      system: "venous",
      region: "pelvis",
      meshName: "Uterine Venous Plexus",
      description:
        "Extensive venous plexus along the lateral uterine walls within the broad ligament. Drains via uterine veins to the internal iliac vein. Communicates with the vaginal and vesical venous plexuses.",
      clinicalSignificance:
        "Markedly engorged during pregnancy. Source of significant hemorrhage during cesarean hysterectomy. Pelvic congestion syndrome involves varicosities of this plexus (and ovarian veins) causing chronic pelvic pain.",
    },
    {
      name: "Presacral Venous Plexus",
      latinName: "Plexus venosus presacralis",
      system: "venous",
      region: "pelvis",
      meshName: "Presacral Venous Plexus",
      description:
        "Thin-walled, valveless basivertebral veins on the anterior sacral surface draining into the anterior internal vertebral venous plexus. Communicate with the median sacral vein and lateral sacral veins.",
      clinicalSignificance:
        "Presacral hemorrhage is one of the most feared surgical emergencies in pelvic surgery. The veins retract into sacral foramina when torn, making hemostasis extremely difficult. Management includes direct pressure, thumbtacks (sterile pins into sacral bone), muscle fragment packing, or Prolene mesh packing. Occurs during presacral dissection for rectal mobilization, sacrocolpopexy, or presacral neurectomy.",
    },

    // ─── NERVOUS ────────────────────────────────────────
    {
      name: "Sacral Plexus (L4-S4)",
      latinName: "Plexus sacralis",
      system: "nervous",
      region: "pelvis",
      meshName: "Sacral Plexus (L4-S4)",
      description:
        "Formed by the ventral rami of L4-S4, converging on the anterior surface of the piriformis muscle. Gives rise to the sciatic nerve (L4-S3), pudendal nerve (S2-S4), superior gluteal nerve (L4-S1), inferior gluteal nerve (L5-S2), nerve to obturator internus, nerve to piriformis, nerve to levator ani (S3-S4), posterior femoral cutaneous nerve, and pelvic splanchnic nerves (S2-S4).",
      clinicalSignificance:
        "Located on the posterior pelvic wall deep to the piriformis. At risk during deep pelvic dissection. The pelvic splanchnic nerves (nervi erigentes) arising from S2-S4 are the parasympathetic supply to the bladder, rectum, and erectile tissue — their preservation is crucial in nerve-sparing radical hysterectomy and rectal surgery.",
    },
    {
      name: "Pudendal Nerve (S2-S4)",
      latinName: "Nervus pudendus",
      system: "nervous",
      region: "perineum",
      meshName: "Pudendal Nerve (S2-S4)",
      description:
        "Arises from S2-S4 ventral rami. Exits the pelvis through the greater sciatic foramen below piriformis, wraps around the ischial spine and sacrospinous ligament, enters the lesser sciatic foramen, and travels in Alcock's canal. Three branches: inferior rectal nerve (external anal sphincter, perianal skin), perineal nerve (perineal muscles, labia), dorsal nerve of the clitoris.",
      clinicalSignificance:
        "Pudendal nerve block at the ischial spine is used for perineal anesthesia during delivery. The nerve is at risk during sacrospinous ligament fixation (passes directly behind the ischial spine). Pudendal neuralgia (Alcock's canal syndrome) causes perineal pain. Damage causes fecal/urinary incontinence and loss of perineal sensation.",
    },
    {
      name: "Obturator Nerve (L2-L4)",
      latinName: "Nervus obturatorius",
      system: "nervous",
      region: "pelvis",
      meshName: "Obturator Nerve (L2-L4)",
      description:
        "Arises from L2-L4 ventral rami (lumbar plexus). Descends along the lateral pelvic wall, posterior to the common iliac vessels and lateral to the internal iliac vessels and ureter. Exits through the obturator canal to supply the adductor muscles and medial thigh skin.",
      clinicalSignificance:
        "At risk during pelvic lymphadenectomy (runs through the obturator fossa immediately adjacent to the obturator lymph nodes). Also at risk during transobturator tape (TOT) sling placement. The obturator reflex (adductor spasm) during TURBT occurs from electrical stimulation. Referred pain from pelvic pathology may present as medial thigh pain.",
    },
    {
      name: "Inferior Hypogastric Plexus",
      latinName: "Plexus hypogastricus inferior",
      system: "nervous",
      region: "pelvis",
      meshName: "Inferior Hypogastric Plexus",
      description:
        "Bilateral pelvic plexus (also called the pelvic plexus) located on the lateral walls of the rectum and vagina, lateral to the uterine cervix and vaginal fornix. Receives: hypogastric nerves (sympathetic from superior hypogastric plexus), pelvic splanchnic nerves (parasympathetic from S2-S4), sacral splanchnic nerves (sympathetic from sacral trunk). Gives subsidiary plexuses: uterovaginal (Frankenhauser's), vesical, and middle rectal.",
      clinicalSignificance:
        "The most critical neural structure at risk during radical hysterectomy, particularly at the parametrial resection and at the junction of the ureter with the posterior uterine artery. Nerve-sparing radical hysterectomy techniques aim to preserve this plexus. Damage causes bladder atony (loss of detrusor function), loss of rectal motility, and sexual dysfunction.",
    },
    {
      name: "Superior Hypogastric Plexus",
      latinName: "Plexus hypogastricus superior",
      system: "nervous",
      region: "pelvis",
      description:
        "Also called the presacral nerve. Located anterior to the L5 vertebral body and sacral promontory, between the common iliac arteries. Receives lumbar splanchnic nerves and divides into right and left hypogastric nerves that descend to the inferior hypogastric plexus.",
      clinicalSignificance:
        "Presacral neurectomy (division of the superior hypogastric plexus) is performed for central dysmenorrhea and chronic pelvic pain. Located in the presacral space — at risk during presacral dissection for rectal surgery and sacrocolpopexy.",
    },
    {
      name: "Pelvic Splanchnic Nerves",
      latinName: "Nervi splanchnici pelvici (nervi erigentes)",
      system: "nervous",
      region: "pelvis",
      description:
        "Parasympathetic fibers from S2-S4 anterior rami. Join the inferior hypogastric plexus. Provide parasympathetic innervation to the bladder detrusor (contraction), rectum (motility), and erectile tissue (vasodilation/engorgement).",
      clinicalSignificance:
        "The 'nervi erigentes' — their preservation is essential for postoperative bladder function and sexual function. Injured during parametrial resection in radical hysterectomy, lateral rectal dissection in TME, and deep pelvic endometriosis excision. Injury causes neurogenic bladder (urinary retention).",
    },
    {
      name: "Sciatic Nerve",
      latinName: "Nervus ischiadicus",
      system: "nervous",
      region: "pelvis",
      description:
        "Largest nerve in the body (L4-S3). Exits pelvis through the greater sciatic foramen below piriformis. Passes immediately posterior to the ischial spine and sacrospinous ligament.",
      clinicalSignificance:
        "At risk during sacrospinous ligament fixation for vaginal vault prolapse — the nerve lies immediately posterior and lateral to the ischial spine. Also at risk during deep pelvic dissection and hip arthroplasty.",
    },
    {
      name: "Nerve to Levator Ani",
      latinName: "Nervus musculi levatoris ani",
      system: "nervous",
      region: "pelvic_floor",
      description:
        "Arises directly from S3-S4 (sometimes S2) sacral rami. Runs on the superior (pelvic) surface of the levator ani, innervating pubococcygeus and iliococcygeus from above. Present as a distinct nerve in ~70% of specimens.",
      clinicalSignificance:
        "Damage during deep pelvic dissection or obstetric injury leads to pelvic floor denervation and subsequent prolapse. This nerve is distinct from the pudendal nerve innervation of the pelvic floor — the levator is innervated from above (nerve to levator ani) and below (pudendal nerve branches).",
    },

    // ─── LYMPHATIC ──────────────────────────────────────
    {
      name: "External Iliac Nodes",
      latinName: "Nodi lymphoidei iliaci externi",
      system: "lymphatic",
      region: "pelvis",
      meshName: "External Iliac Nodes",
      description:
        "Chain of lymph nodes along the external iliac vessels. Subgroups: medial, lateral, and anterior chains. Receive afferents from deep inguinal nodes, internal iliac nodes, and pelvic organs. Efferents drain to common iliac nodes.",
      clinicalSignificance:
        "Drain the upper bladder, upper vagina, cervix, and uterine body. Part of the standard pelvic lymphadenectomy for cervical and endometrial cancer staging. The medial chain is most commonly involved in cervical cancer spread.",
    },
    {
      name: "Obturator Nodes",
      latinName: "Nodi lymphoidei obturatorii",
      system: "lymphatic",
      region: "pelvis",
      meshName: "Obturator Nodes",
      description:
        "Lymph nodes within the obturator fossa, along the obturator vessels. Often considered part of the medial external iliac chain. Drain the cervix, bladder base, and lower uterus.",
      clinicalSignificance:
        "The MOST COMMON site of lymph node metastasis in cervical cancer. First nodes removed in pelvic lymphadenectomy and the sentinel lymph node region for cervical cancer. The obturator nerve runs immediately through this space — risk of injury during dissection.",
    },
    {
      name: "Internal Iliac Nodes",
      latinName: "Nodi lymphoidei iliaci interni",
      system: "lymphatic",
      region: "pelvis",
      meshName: "Internal Iliac Nodes",
      description:
        "Nodes along the internal iliac vessels and lateral pelvic sidewall. Drain pelvic viscera (cervix, lower uterus, upper vagina), lower urinary tract, rectum, and gluteal region.",
      clinicalSignificance:
        "Important in staging cervical, vaginal, and rectal cancers. Located near major vascular structures — careful dissection required.",
    },
    {
      name: "Presacral Nodes",
      latinName: "Nodi lymphoidei sacrales",
      system: "lymphatic",
      region: "pelvis",
      meshName: "Presacral Nodes",
      description:
        "Nodes along the median sacral vessels, anterior to the sacrum in the presacral space. Drain the rectum, posterior cervix, and posterior vaginal wall.",
      clinicalSignificance:
        "Important in staging rectal and cervical cancer. Located in proximity to the presacral venous plexus — dissection carries risk of presacral hemorrhage.",
    },
    {
      name: "Common Iliac Nodes",
      latinName: "Nodi lymphoidei iliaci communes",
      system: "lymphatic",
      region: "pelvis",
      description:
        "Nodes along the common iliac vessels. Include medial, lateral, and subaortic (at aortic bifurcation) subgroups. Receive from external and internal iliac nodes; drain to para-aortic nodes.",
      clinicalSignificance:
        "Involved in advanced stage cervical and endometrial cancer. Extended lymphadenectomy includes these nodes. The subaortic node (at the aortic bifurcation) is a sentinel location.",
    },
    {
      name: "Superficial Inguinal Nodes",
      latinName: "Nodi lymphoidei inguinales superficiales",
      system: "lymphatic",
      region: "inguinal",
      description:
        "Below the inguinal ligament in the femoral triangle. Horizontal chain (along inguinal ligament) and vertical chain (along great saphenous vein). Drain the vulva, lower vagina (below hymen), perineum, perianal skin, lower abdominal wall.",
      clinicalSignificance:
        "Sentinel nodes for vulvar cancer. Inguinal lymphadenectomy is part of staging and treatment for vulvar squamous cell carcinoma. Bilateral dissection required for midline vulvar lesions. Complication: lymphedema, wound breakdown.",
    },
    {
      name: "Para-aortic Nodes",
      latinName: "Nodi lymphoidei lumbales",
      system: "lymphatic",
      region: "retroperitoneum",
      description:
        "Nodes along the aorta and IVC from aortic bifurcation to renal vessels. Subgroups: left lateral aortic, preaortic, right lateral aortic (paracaval), interaortocaval. Receive from common iliac nodes; drain to cisterna chyli.",
      clinicalSignificance:
        "Direct drainage site for ovarian cancer (via ovarian vessels in the infundibulopelvic ligament). Extended lymphadenectomy target in advanced cervical/endometrial cancer. Involvement changes FIGO staging significantly.",
    },

    // ─── ORGANS ─────────────────────────────────────────
    {
      name: "Uterus",
      latinName: "Uterus",
      system: "organs",
      region: "pelvis",
      meshName: "Uterus",
      description:
        "Pear-shaped muscular organ. Parts: fundus (dome-shaped top above tubal insertions), body (corpus), isthmus (narrow segment between body and cervix), and cervix. Three-layered wall: endometrium (functionalis + basalis), myometrium (inner circular, middle oblique, outer longitudinal), perimetrium (serous covering). Typically anteverted (cervical axis vs vaginal axis) and anteflexed (body axis vs cervical axis).",
      clinicalSignificance:
        "Primary support: cardinal ligaments (Level I), uterosacral ligaments (Level I), and levator ani. The uterine artery is the primary blood supply; the ovarian artery provides collateral supply at the fundus. The endometrial spiral arteries are hormone-responsive and are shed during menstruation.",
    },
    {
      name: "Cervix",
      latinName: "Cervix uteri",
      system: "organs",
      region: "pelvis",
      meshName: "Cervix",
      description:
        "Lower portion of the uterus. Supravaginal portion (above vaginal attachment) and vaginal portion (portio vaginalis/ectocervix). Contains the endocervical canal connecting internal os to external os. The squamocolumnar junction (transformation zone) is where columnar endocervical epithelium meets squamous ectocervical epithelium.",
      clinicalSignificance:
        "The transformation zone is the site of cervical neoplasia (CIN) development and where Pap smear sampling is targeted. Critical surgical relationships: ureters pass 1-2 cm laterally, uterine arteries cross superiorly, the parametrium (cardinal ligament) attaches laterally. During radical hysterectomy, the parametrium is resected, requiring identification and preservation of the ureters.",
    },
    {
      name: "Vagina",
      latinName: "Vagina",
      system: "organs",
      region: "pelvis",
      meshName: "Vagina",
      description:
        "Fibromuscular canal, ~7-10 cm in length. Fornices: anterior, posterior (deepest — related to Pouch of Douglas), right lateral, left lateral. Anterior wall is shorter than posterior wall. DeLancey support levels: I (cardinal/uterosacral ligaments — apex), II (paravaginal lateral attachments to ATFP — midvagina), III (perineal body/urogenital diaphragm — distal).",
      clinicalSignificance:
        "Posterior fornix is the thinnest point between the peritoneal cavity and the vagina — used for culdocentesis and posterior colpotomy. Support defects at each DeLancey level produce different types of prolapse: Level I = vault prolapse, Level II = cystocele/rectocele, Level III = urethral hypermobility. Blood supply from vaginal artery, cervicovaginal branch of uterine artery, and internal pudendal artery branches.",
    },
    {
      name: "Urinary Bladder",
      latinName: "Vesica urinaria",
      system: "organs",
      region: "pelvis",
      meshName: "Urinary Bladder",
      description:
        "Muscular reservoir. Parts: apex (connected to median umbilical ligament/urachus), body, fundus/base, and neck. The trigone lies between the two ureteric orifices and the internal urethral orifice — its smooth muscle has separate embryological origin (mesonephric duct). Relations: superior — peritoneum, uterus; anterior — retropubic space; inferior — urogenital diaphragm; posterior — cervix, anterior vaginal wall.",
      clinicalSignificance:
        "Innervation: parasympathetic (pelvic splanchnic nerves S2-S4) contracts the detrusor; sympathetic (hypogastric nerves) relaxes detrusor and contracts internal sphincter. Radical hysterectomy can denervate the bladder causing retention. The bladder is mobilized inferiorly during cesarean section by incising the vesicouterine peritoneal fold.",
    },
    {
      name: "Rectum",
      latinName: "Rectum",
      system: "organs",
      region: "pelvis",
      meshName: "Rectum",
      description:
        "Terminal segment of the large bowel, ~12-15 cm. Begins at S3 vertebral level (rectosigmoid junction), ends at the anorectal junction (level of puborectalis sling). Three lateral flexures create the transverse rectal folds (valves of Houston). Surrounded by mesorectal fat containing lymph nodes, superior rectal vessels, and autonomic nerves, enclosed by the mesorectal fascia.",
      clinicalSignificance:
        "Total mesorectal excision (TME) — sharp dissection in the avascular plane between the mesorectal fascia and the parietal pelvic fascia — is the standard oncologic technique for rectal cancer. Anterior relations: rectovaginal space, posterior vaginal fornix, Pouch of Douglas. The rectum has no serosa below the peritoneal reflection.",
    },
    {
      name: "Ovary (L)",
      latinName: "Ovarium (sinistrum)",
      system: "organs",
      region: "pelvis",
      meshName: "Ovary (L)",
      description:
        "Located in the ovarian fossa (bounded by external iliac vessels superiorly, internal iliac vessels posteriorly, obliterated umbilical artery anteriorly). Attachments: suspensory/infundibulopelvic ligament (to pelvic sidewall — contains ovarian vessels), ovarian ligament (to uterus), mesovarium (to broad ligament). Blood supply: ovarian artery (from aorta). Venous drainage: pampiniform plexus → left ovarian vein → left renal vein.",
      clinicalSignificance:
        "Lymphatic drainage goes DIRECTLY to para-aortic nodes (not pelvic nodes first) via the ovarian vessels in the infundibulopelvic ligament. This is why ovarian cancer staging includes para-aortic lymphadenectomy. The left ovarian vein drains to the left renal vein (right to IVC directly) — incompetent valves cause pelvic congestion syndrome.",
    },
    {
      name: "Ovary (R)",
      latinName: "Ovarium (dextrum)",
      system: "organs",
      region: "pelvis",
      meshName: "Ovary (R)",
      description: "Right ovary. Venous drainage: right ovarian vein drains directly to IVC.",
      clinicalSignificance: "Same clinical significance as left side. Right ovarian vein drains to IVC (not renal vein).",
    },
    {
      name: "Ureter (Pelvic Course)",
      latinName: "Ureter (pars pelvica)",
      system: "organs",
      region: "pelvis",
      description:
        "Enters the pelvis at the bifurcation of the common iliac artery, anterior to the sacroiliac joint. Descends on the pelvic sidewall posterior to the ovary, then turns anteromedially at the ischial spine level. Five pelvic segments: parietal, retroligamentous, intraligamentous (within cardinal ligament), retrovesical, and intravesical (intramural).",
      clinicalSignificance:
        "Three classic sites of ureteric injury in gynecologic surgery: (1) at the pelvic brim where it crosses under the infundibulopelvic ligament (during oophorectomy), (2) at the base of the cardinal ligament where the uterine artery crosses it ('water under the bridge'), and (3) at the intramural segment during bladder entry or vaginal cuff closure. The ureter passes 0.9-2.3 cm lateral to the uterosacral ligament — at risk during uterosacral ligament suspension.",
    },
    {
      name: "Vulva",
      latinName: "Vulva (pudendum femininum)",
      system: "organs",
      region: "perineum",
      description:
        "External female genitalia. Components: mons pubis, labia majora, labia minora, clitoris (glans, body, paired crura, paired bulbs of vestibule), vestibule, urethral meatus, vaginal introitus, Bartholin's (greater vestibular) glands, Skene's (paraurethral) glands, and hymen.",
      clinicalSignificance:
        "Blood supply: internal pudendal artery (primary) and external pudendal arteries. Innervation: pudendal nerve (S2-S4) for posterior vulva, ilioinguinal nerve for anterior labia, genitofemoral nerve for mons. Lymphatic drainage to superficial inguinal nodes — bilateral drainage for midline structures (clitoris, perineal body). Vulvar cancer staging requires inguinal lymph node assessment.",
    },
    {
      name: "Anal Canal",
      latinName: "Canalis analis",
      system: "organs",
      region: "perineum",
      description:
        "Terminal portion, ~3-4 cm. The dentate (pectinate) line divides the upper (columnar epithelium, visceral innervation, portal venous drainage via superior rectal vein) from lower (squamous epithelium, somatic innervation via pudendal nerve, systemic venous drainage via inferior rectal vein). Sphincter complex: internal anal sphincter (involuntary, smooth muscle) and external anal sphincter (voluntary, skeletal muscle).",
      clinicalSignificance:
        "The dentate line determines the lymphatic drainage pattern: above it drains to internal iliac nodes, below it to superficial inguinal nodes. This is critical for cancer staging. Anal fissures, hemorrhoids, and fistulae are common pathologies. The intersphincteric plane is the surgical plane for intersphincteric resection.",
    },

    // ─── FASCIA & LIGAMENTS ─────────────────────────────
    {
      name: "Cardinal Ligament (L)",
      latinName: "Ligamentum cardinale (transversum cervicis) (sinistrum)",
      system: "fascia",
      region: "pelvis",
      meshName: "Cardinal Ligament (L)",
      description:
        "Fan-shaped condensation of the parametrium at the base of the broad ligament (Mackenrodt's ligament). Extends from the lateral cervix and upper vagina to the pelvic sidewall fascia near the internal iliac vessel origin. Contains: uterine artery and vein, ureter (passes through its substance), parametrial lymph nodes, autonomic nerve fibers from the inferior hypogastric plexus.",
      clinicalSignificance:
        "The PRIMARY Level I support of the uterus and upper vagina (DeLancey). Resected during radical hysterectomy (parametrectomy) — the extent of parametrial resection determines the radicality classification. The ureter passes through the cardinal ligament ('ureteral tunnel') and MUST be identified and dissected free before the ligament is transected.",
    },
    {
      name: "Cardinal Ligament (R)",
      latinName: "Ligamentum cardinale (dextrum)",
      system: "fascia",
      region: "pelvis",
      meshName: "Cardinal Ligament (R)",
      description: "Right cardinal (transverse cervical / Mackenrodt's) ligament.",
      clinicalSignificance: "Same clinical significance as left side.",
    },
    {
      name: "Uterosacral Ligament (L)",
      latinName: "Ligamentum uterosacralis (sinistrum)",
      system: "fascia",
      region: "pelvis",
      meshName: "Uterosacral Ligament (L)",
      description:
        "Extends from the posterolateral cervix and posterior vaginal fornix to the periosteum of the sacrum at S2-S4. Contains hypogastric nerve fibers and small vessels. Runs within the medial fibers of the lateral rectal (hypogastric) fascia.",
      clinicalSignificance:
        "Level I support structure — suspends the upper vagina posteriorly and maintains uterine retroversion. Used for uterosacral ligament suspension (McCall culdoplasty) for vaginal vault prolapse. The ureter passes 0.9-2.3 cm lateral to the uterosacral ligament at its cervical insertion — risk of ureteral kinking or injury during suspension procedures. Endometriosis commonly implants on the uterosacral ligaments.",
    },
    {
      name: "Uterosacral Ligament (R)",
      latinName: "Ligamentum uterosacralis (dextrum)",
      system: "fascia",
      region: "pelvis",
      meshName: "Uterosacral Ligament (R)",
      description: "Right uterosacral ligament.",
      clinicalSignificance: "Same clinical significance as left side.",
    },
    {
      name: "Sacrospinous Ligament (L)",
      latinName: "Ligamentum sacrospinale (sinistrum)",
      system: "fascia",
      region: "pelvis",
      meshName: "Sacrospinous Ligament (L)",
      description:
        "From the lateral sacrum/coccyx to the ischial spine. Lies on the anterior surface of the sacrotuberous ligament. The pudendal nerve and internal pudendal vessels wrap around its posterior surface at the ischial spine. Separates the greater and lesser sciatic foramina.",
      clinicalSignificance:
        "Used for sacrospinous ligament fixation (SSLF) for vaginal vault prolapse. The suture is placed 2 cm medial to the ischial spine to avoid the pudendal neurovascular bundle. The sciatic nerve lies immediately posterior. Right-sided fixation is preferred due to easier surgical access (rectum is left-sided). Risk: pudendal nerve entrapment causing buttock/perineal pain, hemorrhage from pudendal or inferior gluteal vessels.",
    },
    {
      name: "Broad Ligament",
      latinName: "Ligamentum latum uteri",
      system: "fascia",
      region: "pelvis",
      description:
        "Double peritoneal fold from the lateral uterus to the pelvic sidewall. Three subdivisions: mesometrium (largest, between round ligament and ovarian ligament — contains uterine vessels), mesosalpinx (mesentery of fallopian tube — contains tubal vessels, epoophoron, paroophoron), mesovarium (connects anterior ovary to broad ligament).",
      clinicalSignificance:
        "Contains the uterine artery and veins, round ligament, ovarian ligament, ureter (at its base), parametrial tissue, lymphatics, and vestigial structures (epoophoron, paroophoron, Gartner's duct). Broad ligament hematomas can develop after difficult deliveries or pelvic trauma and may extend into the retroperitoneum.",
    },
    {
      name: "Infundibulopelvic Ligament",
      latinName: "Ligamentum suspensorium ovarii",
      system: "fascia",
      region: "pelvis",
      description:
        "Suspensory ligament of the ovary. Connects the ovary/tubal infundibulum to the pelvic sidewall at the pelvic brim. Contains the ovarian artery, ovarian vein, ovarian lymphatics, and ovarian nerve plexus.",
      clinicalSignificance:
        "Must be ligated during oophorectomy. The ureter courses beneath this ligament at the pelvic brim — one of the three classic sites of ureteric injury. Contains the lymphatic drainage pathway from the ovary directly to para-aortic nodes.",
    },
    {
      name: "Perineal Body",
      latinName: "Corpus perineale",
      system: "fascia",
      region: "perineum",
      description:
        "Fibromuscular node (central tendon of the perineum) between the vagina and anal canal. Convergence point for: bulbospongiosus, superficial and deep transverse perineal muscles, external anal sphincter, portions of levator ani (puboperinealis), and rectovaginal fascia.",
      clinicalSignificance:
        "CRITICAL structure for pelvic organ support — acts as the 'keystone' of the pelvic floor. Disruption during obstetric injury leads to widened genital hiatus and subsequent prolapse. Site of episiotomy. The perineal body reconstruction (perineorrhaphy) is a key step in posterior prolapse repair.",
    },
    {
      name: "Waldeyer's Fascia",
      latinName: "Fascia rectosacralis (Waldeyer)",
      system: "fascia",
      region: "pelvis",
      description:
        "Rectosacral fascia. Originates from the presacral fascia at S2-S4 level, extends anteroinferiorly to fuse with the posterior mesorectal fascia at the anorectal junction level. Separates the presacral space (above) from the retrorectal space (below).",
      clinicalSignificance:
        "Must be divided during posterior rectal mobilization to reach the pelvic floor. Marks the transition from the relatively avascular presacral dissection plane to the more vascular tissue near the anorectal junction. Failure to identify Waldeyer's fascia can lead to dissection into the presacral venous plexus.",
    },
    {
      name: "Arcus Tendineus Fasciae Pelvis (ATFP)",
      latinName: "Arcus tendineus fasciae pelvis",
      system: "fascia",
      region: "pelvis",
      description:
        "The 'white line' — ~10 cm fibrous condensation of pelvic fascia from the pubic bone (near symphysis) to the ischial spine, along the medial surface of the obturator internus fascia. Lateral attachment point for the pubocervical fascia and anterior vaginal wall.",
      clinicalSignificance:
        "Paravaginal defect (lateral detachment of the vagina from the ATFP) is a major cause of anterior vaginal wall prolapse (cystocele). Paravaginal defect repair reattaches the vaginal wall to the ATFP. Key anatomical landmark in vaginal and laparoscopic prolapse surgery.",
    },

    // ─── PELVIC SPACES ─────────────────────────────────
    {
      name: "Retropubic Space (Space of Retzius)",
      latinName: "Spatium retropubicum (Retzii)",
      system: "spaces",
      region: "pelvis",
      meshName: "Retropubic Space (Space of Retzius)",
      description:
        "Potential space between the posterior pubic symphysis/superior pubic rami (anterior) and the anterior bladder wall (posterior). Contains loose areolar tissue and fat. Bounded laterally by the obturator internus fascia, superiorly by the anterior peritoneal reflection, and inferiorly by the pubovesical ligaments.",
      clinicalSignificance:
        "Accessed for Burch colposuspension, retropubic midurethral sling (TVT), radical cystectomy, and paravaginal defect repair. Contains the dorsal venous complex of the clitoris, aberrant obturator vessels (corona mortis), and the retropubic venous plexus (Santorini's plexus equivalent). Hemorrhage risk from venous plexus and corona mortis is the primary danger.",
    },
    {
      name: "Vesicovaginal Space",
      latinName: "Spatium vesicovaginale",
      system: "spaces",
      region: "pelvis",
      meshName: "Vesicovaginal Space",
      description:
        "Potential space between the posterior bladder wall/vesical fascia (anterior) and the anterior vaginal wall/pubocervical fascia (posterior). Bounded laterally by the vesical pillars (bladder pillars) and lateral cervical ligaments, superiorly by the vesicouterine peritoneal fold, and inferiorly by the urogenital diaphragm/trigone.",
      clinicalSignificance:
        "Dissected during hysterectomy (vaginal and abdominal) to mobilize the bladder off the cervix and upper vagina. Also entered for anterior colporrhaphy and vesicovaginal fistula repair. Lateral dissection risks ureteric injury — the uterine artery crosses the ureter at the lateral boundary of this space.",
    },
    {
      name: "Rectovaginal Space",
      latinName: "Spatium rectovaginale",
      system: "spaces",
      region: "pelvis",
      meshName: "Rectovaginal Space",
      description:
        "Potential space between the posterior vaginal wall with rectovaginal fascia/Denonvilliers' fascia equivalent (anterior) and the anterior rectal wall with mesorectal fascia (posterior). Bounded laterally by the uterosacral ligaments, superiorly by the Pouch of Douglas peritoneal reflection, and inferiorly by the perineal body.",
      clinicalSignificance:
        "Avascular plane created by dissecting between the two layers of Denonvilliers' fascia equivalent. Key dissection plane for posterior colporrhaphy, deep infiltrating endometriosis excision, radical hysterectomy, and low anterior resection. Rectovaginal fistulae occur in this space.",
    },
    {
      name: "Pouch of Douglas (Rectouterine Pouch)",
      latinName: "Excavatio rectouterina (Douglas)",
      system: "spaces",
      region: "pelvis",
      meshName: "Pouch of Douglas (Rectouterine Pouch)",
      description:
        "The most dependent part of the peritoneal cavity in the upright position. Located between the posterior uterus/upper posterior vagina (anterior) and the anterior rectum (posterior). Bounded laterally by the uterosacral ligament folds and inferiorly by the rectovaginal septum.",
      clinicalSignificance:
        "Common site for fluid collections (blood in ruptured ectopic pregnancy, pus in pelvic abscess, ascites in malignancy), endometriosis implants, and cul-de-sac obliteration. Accessed by culdocentesis (needle through posterior fornix), posterior colpotomy, or laparoscopically. Enterocele herniations descend into this space. The posterior fornix of the vagina is separated from the Pouch of Douglas by only the vaginal wall and peritoneum.",
    },
    {
      name: "Pararectal Space (L)",
      latinName: "Spatium pararectale (sinistrum)",
      system: "spaces",
      region: "pelvis",
      meshName: "Pararectal Space (L)",
      description:
        "Potential space bounded anteromedially by the ureter and uterosacral ligament, posterolaterally by the internal iliac artery and its branches, medially by the rectum and mesorectal fascia, laterally by the internal iliac vessels along the pelvic sidewall, inferiorly by the levator ani, and superiorly by the pelvic brim.",
      clinicalSignificance:
        "Developed during radical hysterectomy to expose the cardinal ligament and visualize the ureter, allowing safe parametrial resection. Also entered during pelvic lymphadenectomy. The middle rectal artery crosses this space. Development of this space (along with the paravesical space) is the foundation of Wertheim's radical hysterectomy.",
    },
    {
      name: "Paravesical Space (L)",
      latinName: "Spatium paravesicale (sinistrum)",
      system: "spaces",
      region: "pelvis",
      meshName: "Paravesical Space (L)",
      description:
        "Potential space bounded medially by the bladder and obliterated umbilical artery (superior vesical artery), laterally by the obturator internus muscle/fascia and external iliac vessels, anteriorly merging with the retropubic space (Space of Retzius), posteriorly by the cardinal ligament (base of broad ligament), inferiorly by the levator ani/endopelvic fascia, and superiorly by the pelvic brim.",
      clinicalSignificance:
        "Developed during radical hysterectomy and pelvic lymphadenectomy. Contains the obturator neurovascular bundle — risk of injury to the obturator nerve, artery, and vein during dissection. The obliterated umbilical artery is a key surgical landmark identifying the medial boundary.",
    },
    {
      name: "Presacral Space",
      latinName: "Spatium presacrale",
      system: "spaces",
      region: "pelvis",
      meshName: "Presacral Space",
      description:
        "Potential space between the mesorectal fascia/fascia propria of the rectum (anterior) and the presacral fascia overlying the anterior sacrum (posterior). Bounded laterally by the iliac vessels, ureters, and hypogastric fascia, superiorly by the rectosigmoid peritoneal reflection, and inferiorly by Waldeyer's fascia (rectosacral fascia at S2-S4 level).",
      clinicalSignificance:
        "Contains the presacral venous plexus (basivertebral veins), median sacral artery and vein, lateral sacral vessels, presacral lymph nodes, and the superior hypogastric plexus (presacral nerve). Presacral hemorrhage from the venous plexus is LIFE-THREATENING — veins retract into foramina, making control extremely difficult. Accessed for sacrocolpopexy, presacral neurectomy, and rectal mobilization. Site of developmental tumors (teratomas, chordomas).",
    },
    {
      name: "Ischioanal Fossa (L)",
      latinName: "Fossa ischioanalis (sinistra)",
      system: "spaces",
      region: "perineum",
      meshName: "Ischioanal Fossa (L)",
      description:
        "Wedge-shaped space in the perineum. Bounded medially by the external anal sphincter and levator ani, laterally by the ischial tuberosity and obturator internus muscle/fascia, posteriorly by the sacrotuberous ligament and gluteus maximus, anteriorly by the perineal membrane, apex at the junction of obturator fascia and levator ani, base at the perineal skin.",
      clinicalSignificance:
        "Contains Alcock's canal (pudendal canal) on the lateral wall with the internal pudendal artery, internal pudendal vein, and pudendal nerve. The inferior rectal artery, vein, and nerve cross the space. Filled with fat that allows distension during defecation and parturition. Site of ischiorectal/perianal abscesses. Pudendal nerve block is performed transvaginally targeting the ischial spine.",
    },
    {
      name: "Vesicouterine Pouch",
      latinName: "Excavatio vesicouterina",
      system: "spaces",
      region: "pelvis",
      meshName: "Vesicouterine Pouch",
      description:
        "Peritoneal recess between the posterior superior surface of the bladder (anterior) and the anterior surface of the uterine body at the isthmus (posterior). Bounded laterally by lateral peritoneal folds. Shallower than the Pouch of Douglas.",
      clinicalSignificance:
        "Site of the peritoneal incision during cesarean section (the vesicouterine fold is incised to reflect the bladder inferiorly, exposing the lower uterine segment). Vesicouterine fistula can occur here (Youssef syndrome — after cesarean section). Endometriosis can implant on this peritoneal reflection.",
    },
    {
      name: "Obturator Space",
      latinName: "Fossa obturatoria",
      system: "spaces",
      region: "pelvis",
      description:
        "Space within the obturator fossa. Bounded laterally by the obturator internus muscle/fascia, medially by the internal iliac vessels and ureter, anteriorly by the external iliac vein, posteriorly by the internal iliac artery and lumbosacral trunk, superiorly by the external iliac vein, and inferiorly by the obturator foramen and canal.",
      clinicalSignificance:
        "Contains the obturator nerve, artery, vein, obturator lymph nodes, and fat. Site of obturator lymphadenectomy — the most common procedure in gynecologic oncology staging. The obturator nerve must be identified and preserved during dissection. Accessed during pelvic lymphadenectomy for cervical, endometrial, and bladder cancers.",
    },
  ];

  const inserted = await db
    .insert(schema.anatomicalStructure)
    .values(structures)
    .returning();

  console.log(`Inserted ${inserted.length} structures`);

  // Create lookup by name
  const byName = new Map(inserted.map((s) => [s.name, s]));

  // Helper to get ID safely
  const id = (name: string) => {
    const s = byName.get(name);
    if (!s) {
      console.warn(`Structure not found: ${name}`);
      return null;
    }
    return s.id;
  };

  // ─── SPACE BORDERS ──────────────────────────────────
  console.log("Seeding space borders...");

  type NewBorder = typeof schema.spaceBorder.$inferInsert;
  const borders: NewBorder[] = [
    // Retropubic Space (Space of Retzius)
    { spaceId: id("Retropubic Space (Space of Retzius)")!, direction: "anterior", borderStructureId: id("Pubic Symphysis"), description: "Posterior surface of pubic symphysis and superior pubic rami" },
    { spaceId: id("Retropubic Space (Space of Retzius)")!, direction: "posterior", borderStructureId: id("Urinary Bladder"), description: "Anterior wall of the urinary bladder (vesical fascia)" },
    { spaceId: id("Retropubic Space (Space of Retzius)")!, direction: "lateral", borderStructureId: id("Obturator Internus"), description: "Obturator internus fascia bilaterally" },
    { spaceId: id("Retropubic Space (Space of Retzius)")!, direction: "superior", description: "Anterior peritoneal reflection from the undersurface of the anterior abdominal wall" },
    { spaceId: id("Retropubic Space (Space of Retzius)")!, direction: "inferior", description: "Pubovesical ligaments and endopelvic fascia" },

    // Vesicovaginal Space
    { spaceId: id("Vesicovaginal Space")!, direction: "anterior", borderStructureId: id("Urinary Bladder"), description: "Posterior wall of the bladder (vesical fascia)" },
    { spaceId: id("Vesicovaginal Space")!, direction: "posterior", borderStructureId: id("Vagina"), description: "Anterior vaginal wall (pubocervical fascia)" },
    { spaceId: id("Vesicovaginal Space")!, direction: "lateral", description: "Vesical pillars (bladder pillars) and lateral cervical ligaments" },
    { spaceId: id("Vesicovaginal Space")!, direction: "superior", description: "Anterior peritoneal reflection at vesicouterine pouch" },
    { spaceId: id("Vesicovaginal Space")!, direction: "inferior", description: "Urogenital diaphragm / trigone of bladder" },

    // Rectovaginal Space
    { spaceId: id("Rectovaginal Space")!, direction: "anterior", borderStructureId: id("Vagina"), description: "Posterior vaginal wall (rectovaginal fascia / Denonvilliers' equivalent)" },
    { spaceId: id("Rectovaginal Space")!, direction: "posterior", borderStructureId: id("Rectum"), description: "Anterior rectal wall (mesorectal fascia)" },
    { spaceId: id("Rectovaginal Space")!, direction: "lateral", description: "Uterosacral ligaments (cranially), rectovaginal ligaments (caudally)" },
    { spaceId: id("Rectovaginal Space")!, direction: "superior", description: "Peritoneal reflection of Pouch of Douglas" },
    { spaceId: id("Rectovaginal Space")!, direction: "inferior", description: "Perineal body / levator ani muscles" },

    // Pouch of Douglas
    { spaceId: id("Pouch of Douglas (Rectouterine Pouch)")!, direction: "anterior", borderStructureId: id("Uterus"), description: "Posterior wall of uterus and upper posterior vagina" },
    { spaceId: id("Pouch of Douglas (Rectouterine Pouch)")!, direction: "posterior", borderStructureId: id("Rectum"), description: "Anterior wall of the rectum" },
    { spaceId: id("Pouch of Douglas (Rectouterine Pouch)")!, direction: "lateral", description: "Uterosacral ligament folds (rectouterine folds)" },
    { spaceId: id("Pouch of Douglas (Rectouterine Pouch)")!, direction: "inferior", description: "Rectovaginal septum" },

    // Pararectal Space (L)
    { spaceId: id("Pararectal Space (L)")!, direction: "anterior", description: "Ureter and uterosacral ligament (anteromedial)" },
    { spaceId: id("Pararectal Space (L)")!, direction: "posterior", description: "Internal iliac artery and its branches (posterolateral)" },
    { spaceId: id("Pararectal Space (L)")!, direction: "lateral", description: "Internal iliac vessels along pelvic sidewall" },
    { spaceId: id("Pararectal Space (L)")!, direction: "medial", borderStructureId: id("Rectum"), description: "Rectum and mesorectal fascia" },
    { spaceId: id("Pararectal Space (L)")!, direction: "inferior", borderStructureId: id("Levator Ani"), description: "Levator ani muscle" },
    { spaceId: id("Pararectal Space (L)")!, direction: "superior", description: "Pelvic brim" },

    // Paravesical Space (L)
    { spaceId: id("Paravesical Space (L)")!, direction: "medial", borderStructureId: id("Urinary Bladder"), description: "Bladder and obliterated umbilical artery (superior vesical artery)" },
    { spaceId: id("Paravesical Space (L)")!, direction: "lateral", borderStructureId: id("Obturator Internus"), description: "Obturator internus muscle/fascia and external iliac vessels" },
    { spaceId: id("Paravesical Space (L)")!, direction: "anterior", description: "Merges with the retropubic space (Space of Retzius)" },
    { spaceId: id("Paravesical Space (L)")!, direction: "posterior", description: "Cardinal ligament (base of broad ligament)" },
    { spaceId: id("Paravesical Space (L)")!, direction: "inferior", borderStructureId: id("Levator Ani"), description: "Levator ani / endopelvic fascia" },

    // Presacral Space
    { spaceId: id("Presacral Space")!, direction: "anterior", borderStructureId: id("Rectum"), description: "Mesorectal fascia (fascia propria of rectum)" },
    { spaceId: id("Presacral Space")!, direction: "posterior", borderStructureId: id("Sacrum"), description: "Presacral fascia overlying the anterior sacrum, anterior longitudinal vertebral ligament" },
    { spaceId: id("Presacral Space")!, direction: "lateral", description: "Iliac vessels, ureters, hypogastric fascia" },
    { spaceId: id("Presacral Space")!, direction: "superior", description: "Peritoneal reflection of the rectosigmoid" },
    { spaceId: id("Presacral Space")!, direction: "inferior", description: "Waldeyer's fascia (rectosacral fascia) at S2-S4 level, coccyx" },

    // Ischioanal Fossa (L)
    { spaceId: id("Ischioanal Fossa (L)")!, direction: "medial", borderStructureId: id("Levator Ani"), description: "External anal sphincter and levator ani (pelvic diaphragm)" },
    { spaceId: id("Ischioanal Fossa (L)")!, direction: "lateral", description: "Ischial tuberosity and obturator internus muscle/fascia" },
    { spaceId: id("Ischioanal Fossa (L)")!, direction: "posterior", description: "Sacrotuberous ligament and gluteus maximus" },
    { spaceId: id("Ischioanal Fossa (L)")!, direction: "anterior", description: "Posterior border of perineal membrane (urogenital diaphragm)" },
    { spaceId: id("Ischioanal Fossa (L)")!, direction: "superior", description: "Apex: junction of obturator fascia and levator ani fascia" },

    // Vesicouterine Pouch
    { spaceId: id("Vesicouterine Pouch")!, direction: "anterior", borderStructureId: id("Urinary Bladder"), description: "Posterior superior surface of bladder" },
    { spaceId: id("Vesicouterine Pouch")!, direction: "posterior", borderStructureId: id("Uterus"), description: "Anterior surface of uterine body (isthmus)" },
    { spaceId: id("Vesicouterine Pouch")!, direction: "lateral", description: "Lateral folds of peritoneum" },

    // Obturator Space
    { spaceId: id("Obturator Space")!, direction: "lateral", borderStructureId: id("Obturator Internus"), description: "Obturator internus muscle and fascia" },
    { spaceId: id("Obturator Space")!, direction: "medial", description: "Internal iliac vessels, ureter" },
    { spaceId: id("Obturator Space")!, direction: "anterior", description: "External iliac vein" },
    { spaceId: id("Obturator Space")!, direction: "posterior", description: "Internal iliac artery, lumbosacral trunk" },
    { spaceId: id("Obturator Space")!, direction: "inferior", description: "Obturator foramen and canal" },
  ].filter((b) => b.spaceId != null);

  if (borders.length > 0) {
    await db.insert(schema.spaceBorder).values(borders);
    console.log(`Inserted ${borders.length} space borders`);
  }

  // ─── STRUCTURE RELATIONSHIPS ──────────────────────────
  console.log("Seeding structure relationships...");

  type NewRelation = typeof schema.structureRelation.$inferInsert;
  const relations: NewRelation[] = [
    // Arterial supply
    { sourceId: id("Uterus")!, targetId: id("Uterine Artery")!, relationType: "arterial_supply" },
    { sourceId: id("Uterus")!, targetId: id("Ovarian Artery")!, relationType: "arterial_supply" },
    { sourceId: id("Cervix")!, targetId: id("Uterine Artery")!, relationType: "arterial_supply" },
    { sourceId: id("Vagina")!, targetId: id("Uterine Artery")!, relationType: "arterial_supply" },
    { sourceId: id("Vagina")!, targetId: id("Internal Pudendal Artery")!, relationType: "arterial_supply" },
    { sourceId: id("Urinary Bladder")!, targetId: id("Internal Iliac Artery (L)")!, relationType: "arterial_supply" },
    { sourceId: id("Rectum")!, targetId: id("Superior Rectal Artery")!, relationType: "arterial_supply" },
    { sourceId: id("Rectum")!, targetId: id("Internal Iliac Artery (L)")!, relationType: "arterial_supply" },
    { sourceId: id("Ovary (L)")!, targetId: id("Ovarian Artery")!, relationType: "arterial_supply" },
    { sourceId: id("Vulva")!, targetId: id("Internal Pudendal Artery")!, relationType: "arterial_supply" },

    // Innervation
    { sourceId: id("Levator Ani")!, targetId: id("Nerve to Levator Ani")!, relationType: "innervation" },
    { sourceId: id("Levator Ani")!, targetId: id("Pudendal Nerve (S2-S4)")!, relationType: "innervation" },
    { sourceId: id("External Anal Sphincter")!, targetId: id("Pudendal Nerve (S2-S4)")!, relationType: "innervation" },
    { sourceId: id("External Urethral Sphincter")!, targetId: id("Pudendal Nerve (S2-S4)")!, relationType: "innervation" },
    { sourceId: id("Bulbospongiosus")!, targetId: id("Pudendal Nerve (S2-S4)")!, relationType: "innervation" },
    { sourceId: id("Urinary Bladder")!, targetId: id("Pelvic Splanchnic Nerves")!, relationType: "innervation" },
    { sourceId: id("Urinary Bladder")!, targetId: id("Inferior Hypogastric Plexus")!, relationType: "innervation" },
    { sourceId: id("Rectum")!, targetId: id("Pelvic Splanchnic Nerves")!, relationType: "innervation" },
    { sourceId: id("Rectum")!, targetId: id("Inferior Hypogastric Plexus")!, relationType: "innervation" },
    { sourceId: id("Uterus")!, targetId: id("Inferior Hypogastric Plexus")!, relationType: "innervation" },
    { sourceId: id("Vulva")!, targetId: id("Pudendal Nerve (S2-S4)")!, relationType: "innervation" },
    { sourceId: id("Obturator Internus")!, targetId: id("Sacral Plexus (L4-S4)")!, relationType: "innervation" },
    { sourceId: id("Piriformis")!, targetId: id("Sacral Plexus (L4-S4)")!, relationType: "innervation" },

    // Lymphatic drainage
    { sourceId: id("Cervix")!, targetId: id("Obturator Nodes")!, relationType: "lymphatic_drainage" },
    { sourceId: id("Cervix")!, targetId: id("Internal Iliac Nodes")!, relationType: "lymphatic_drainage" },
    { sourceId: id("Cervix")!, targetId: id("External Iliac Nodes")!, relationType: "lymphatic_drainage" },
    { sourceId: id("Uterus")!, targetId: id("External Iliac Nodes")!, relationType: "lymphatic_drainage" },
    { sourceId: id("Uterus")!, targetId: id("Internal Iliac Nodes")!, relationType: "lymphatic_drainage" },
    { sourceId: id("Uterus")!, targetId: id("Para-aortic Nodes")!, relationType: "lymphatic_drainage" },
    { sourceId: id("Ovary (L)")!, targetId: id("Para-aortic Nodes")!, relationType: "lymphatic_drainage" },
    { sourceId: id("Vagina")!, targetId: id("Internal Iliac Nodes")!, relationType: "lymphatic_drainage" },
    { sourceId: id("Vulva")!, targetId: id("Superficial Inguinal Nodes")!, relationType: "lymphatic_drainage" },
    { sourceId: id("Rectum")!, targetId: id("Presacral Nodes")!, relationType: "lymphatic_drainage" },
    { sourceId: id("Rectum")!, targetId: id("Internal Iliac Nodes")!, relationType: "lymphatic_drainage" },
    { sourceId: id("Urinary Bladder")!, targetId: id("External Iliac Nodes")!, relationType: "lymphatic_drainage" },
    { sourceId: id("Urinary Bladder")!, targetId: id("Internal Iliac Nodes")!, relationType: "lymphatic_drainage" },
    { sourceId: id("Anal Canal")!, targetId: id("Superficial Inguinal Nodes")!, relationType: "lymphatic_drainage" },

    // Venous drainage
    { sourceId: id("Uterus")!, targetId: id("Uterine Venous Plexus")!, relationType: "venous_drainage" },
    { sourceId: id("Uterus")!, targetId: id("Internal Iliac Vein (L)")!, relationType: "venous_drainage" },
    { sourceId: id("Rectum")!, targetId: id("Internal Iliac Vein (L)")!, relationType: "venous_drainage" },
  ].filter((r) => r.sourceId != null && r.targetId != null);

  if (relations.length > 0) {
    await db.insert(schema.structureRelation).values(relations);
    console.log(`Inserted ${relations.length} relationships`);
  }

  console.log("Seed complete!");
  await client.end();
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
