import type { AnatomicalSystem } from "../types/anatomy";

export interface ProcedureStep {
  title: string;
  description: string;
  structures: string[];
  atRisk: string[];
  systems: AnatomicalSystem[];
  camera?: { position: [number, number, number]; target: [number, number, number] };
}

export interface Procedure {
  id: string;
  name: string;
  shortName: string;
  category: string;
  description: string;
  steps: ProcedureStep[];
}

export const PROCEDURES: Procedure[] = [
  {
    id: "tah",
    name: "Total Abdominal Hysterectomy",
    shortName: "TAH",
    category: "Gynecologic",
    description: "Removal of the uterus and cervix via abdominal approach. The most common major gynecologic surgery.",
    steps: [
      {
        title: "Round Ligament Division",
        description: "Identify and divide the round ligaments bilaterally to enter the broad ligament. This opens the retroperitoneal space and provides access to the pelvic sidewall structures.",
        structures: ["Round Ligament (L)", "Round Ligament (R)", "Broad Ligament (L)", "Broad Ligament (R)"],
        atRisk: [],
        systems: ["fascia"],
        camera: { position: [0, 2, 4], target: [0, 0, 0.15] },
      },
      {
        title: "Adnexal Pedicle",
        description: "If performing oophorectomy: ligate the infundibulopelvic (IP) ligaments containing the ovarian vessels. The ureter crosses BENEATH the IP ligament at the pelvic brim — one of three classic sites of ureteric injury.",
        structures: ["Infundibulopelvic Ligament (L)", "Infundibulopelvic Ligament (R)", "Ovary (L)", "Ovary (R)", "Fallopian Tube (L)", "Fallopian Tube (R)"],
        atRisk: ["Ureter (L)", "Ureter (R)"],
        systems: ["fascia", "organs"],
        camera: { position: [0, 3, 3], target: [0, 0.3, 0.15] },
      },
      {
        title: "Bladder Flap Development",
        description: "Incise the vesicouterine peritoneum and develop the bladder flap inferiorly, mobilizing the bladder off the lower uterine segment and cervix. Stay in the avascular plane between bladder and cervix.",
        structures: ["Vesicouterine Pouch", "Urinary Bladder", "Vesicovaginal Space"],
        atRisk: ["Urinary Bladder"],
        systems: ["organs", "spaces"],
        camera: { position: [0, 1, 4], target: [0, -0.2, 0.5] },
      },
      {
        title: "Uterine Artery Ligation",
        description: "Skeletonize and ligate the uterine arteries at the level of the internal cervical os. Remember: 'Water under the bridge' — the uterine artery crosses OVER the ureter ~1-2cm lateral to the cervix.",
        structures: ["Uterine Artery (L)", "Uterine Artery (R)", "Uterine Artery Ascending (L)", "Uterine Artery Ascending (R)"],
        atRisk: ["Ureter (L)", "Ureter (R)"],
        systems: ["arterial", "organs"],
        camera: { position: [-2, 1, 3], target: [0, -0.1, 0.1] },
      },
      {
        title: "Cardinal Ligament Division",
        description: "Sequentially clamp and divide the cardinal ligaments (Mackenrodt's) from the cervix toward the vaginal fornix. The ureter courses through the cardinal ligament in the 'ureteral tunnel' — the second classic injury site.",
        structures: ["Cardinal Ligament (L)", "Cardinal Ligament (R)"],
        atRisk: ["Ureter (L)", "Ureter (R)"],
        systems: ["fascia"],
        camera: { position: [-3, 1, 2], target: [0, -0.1, 0.05] },
      },
      {
        title: "Uterosacral Ligament Division",
        description: "Divide the uterosacral ligaments posteriorly. These provide Level I support — consider McCall culdoplasty (plication) at closure for vault prolapse prevention. The ureter passes 0.9-2.3cm lateral to the uterosacral ligament.",
        structures: ["Uterosacral Ligament (L)", "Uterosacral Ligament (R)"],
        atRisk: ["Ureter (L)", "Ureter (R)"],
        systems: ["fascia"],
        camera: { position: [0, 1, -4], target: [0, 0, -0.3] },
      },
      {
        title: "Vaginal Entry & Specimen Removal",
        description: "Enter the vagina circumferentially around the cervix. Remove the uterus en bloc. Close the vaginal cuff with figure-of-eight or running delayed absorbable sutures. Consider incorporating uterosacral ligaments into the cuff closure.",
        structures: ["Vagina", "Cervix", "Uterus"],
        atRisk: [],
        systems: ["organs"],
        camera: { position: [0, -1, 4], target: [0, -0.3, 0.15] },
      },
    ],
  },
  {
    id: "cesarean",
    name: "Cesarean Section (Lower Segment)",
    shortName: "C-Section",
    category: "Obstetric",
    description: "Delivery of the fetus through a transverse lower uterine segment incision. The most commonly performed surgery worldwide.",
    steps: [
      {
        title: "Identify Vesicouterine Fold",
        description: "After entering the peritoneal cavity, identify the vesicouterine fold of peritoneum overlying the lower uterine segment. The bladder should be visible as a smooth structure anterior to the uterus.",
        structures: ["Vesicouterine Pouch", "Uterus", "Urinary Bladder"],
        atRisk: [],
        systems: ["organs", "spaces"],
        camera: { position: [0, 2, 4], target: [0, 0, 0.4] },
      },
      {
        title: "Bladder Flap Creation",
        description: "Incise the vesicouterine peritoneum transversely and reflect the bladder inferiorly to expose the lower uterine segment. In repeat cesareans, adhesions may make this step hazardous — risk of cystotomy increases with each prior surgery.",
        structures: ["Vesicouterine Pouch", "Urinary Bladder", "Vesicovaginal Space"],
        atRisk: ["Urinary Bladder"],
        systems: ["organs", "spaces"],
        camera: { position: [0, 1, 4.5], target: [0, -0.1, 0.5] },
      },
      {
        title: "Uterine Incision (Kerr)",
        description: "Make a transverse curvilinear incision (Kerr incision) in the lower uterine segment. Extend bluntly with fingers to avoid lateral extension into the uterine vessels. A classical (vertical) incision may be needed for extreme prematurity or transverse lie.",
        structures: ["Uterus"],
        atRisk: ["Uterine Artery (L)", "Uterine Artery (R)"],
        systems: ["organs"],
        camera: { position: [0, 1.5, 3.5], target: [0, -0.1, 0.15] },
      },
      {
        title: "Closure",
        description: "After delivery and placental removal, close the uterine incision in one or two layers with absorbable suture. Inspect for hemostasis. Optionally re-peritonealize the bladder flap. Close abdominal wall in layers.",
        structures: ["Uterus", "Urinary Bladder"],
        atRisk: [],
        systems: ["organs"],
        camera: { position: [0, 2, 4], target: [0, 0, 0.3] },
      },
    ],
  },
  {
    id: "sacrocolpopexy",
    name: "Sacrocolpopexy",
    shortName: "Sacrocolpopexy",
    category: "Urogynecologic",
    description: "Gold standard for apical vaginal vault prolapse repair. Mesh is anchored between the vaginal apex and the anterior sacral periosteum.",
    steps: [
      {
        title: "Presacral Dissection",
        description: "Incise the peritoneum over the sacral promontory at S1-S2. Expose the anterior longitudinal ligament while staying strictly in the midline. The presacral venous plexus lies laterally — veins retract into sacral foramina if torn, making hemorrhage LIFE-THREATENING.",
        structures: ["Presacral Space", "Sacrum"],
        atRisk: ["Presacral Venous Plexus", "Median Sacral Artery"],
        systems: ["skeletal", "spaces"],
        camera: { position: [0, 2, -4], target: [0, 0.4, -0.9] },
      },
      {
        title: "Preserve Presacral Nerves",
        description: "Identify and preserve the superior hypogastric plexus (presacral nerve) at the sacral promontory between the common iliac arteries. Dissect lateral to the midline nerve fibers. Damage causes constipation and sexual dysfunction.",
        structures: ["Superior Hypogastric Plexus", "Hypogastric Nerve (L)", "Hypogastric Nerve (R)"],
        atRisk: ["Superior Hypogastric Plexus"],
        systems: ["nervous"],
        camera: { position: [0, 2.5, -3.5], target: [0, 0.8, -0.6] },
      },
      {
        title: "Vaginal Dissection",
        description: "Develop the rectovaginal and vesicovaginal spaces to expose the anterior and posterior vaginal walls for mesh attachment. These are avascular planes when entered correctly.",
        structures: ["Vagina", "Rectovaginal Space", "Vesicovaginal Space"],
        atRisk: ["Rectum"],
        systems: ["organs", "spaces"],
        camera: { position: [2, 1, 3], target: [0, -0.3, 0] },
      },
      {
        title: "Mesh Placement & Sacral Fixation",
        description: "Attach lightweight polypropylene mesh to the anterior and posterior vaginal walls. Fix the posterior mesh arm to the anterior sacral periosteum at S1 with 2-3 permanent sutures. Tension the mesh to restore normal vaginal axis without over-tightening.",
        structures: ["Sacrum", "Vagina"],
        atRisk: ["Presacral Venous Plexus"],
        systems: ["skeletal", "organs"],
        camera: { position: [-2, 2, -3], target: [0, 0, -0.4] },
      },
      {
        title: "Peritoneal Closure",
        description: "Re-peritonealize the mesh completely to prevent bowel adhesion and mesh erosion. Run a continuous absorbable suture over the entire mesh from the sacral promontory to the vaginal cuff.",
        structures: ["Sacrum", "Vagina", "Rectum"],
        atRisk: [],
        systems: ["organs", "skeletal"],
        camera: { position: [0, 3, 2], target: [0, 0, 0] },
      },
    ],
  },
  {
    id: "sslf",
    name: "Sacrospinous Ligament Fixation",
    shortName: "SSLF",
    category: "Urogynecologic",
    description: "Vaginal approach to apical prolapse repair. The vaginal cuff is suspended from the sacrospinous ligament, typically on the right side to avoid the rectosigmoid.",
    steps: [
      {
        title: "Posterior Vaginal Wall Incision",
        description: "Make a midline incision in the posterior vaginal wall. Enter the rectovaginal space by sharp and blunt dissection, separating the vaginal wall from the underlying rectum.",
        structures: ["Vagina", "Rectovaginal Space"],
        atRisk: ["Rectum"],
        systems: ["organs", "spaces"],
        camera: { position: [0, -1, 4], target: [0, -0.4, -0.1] },
      },
      {
        title: "Pararectal Space Development",
        description: "Develop the right pararectal space by blunt dissection lateral to the rectum. Palpate the ischial spine as the key landmark — it is the origin of the sacrospinous ligament.",
        structures: ["Pararectal Space (R)", "Rectum", "Ischial Spine (R)"],
        atRisk: [],
        systems: ["spaces", "skeletal", "organs"],
        camera: { position: [3, 0, -1], target: [0.6, -0.2, -0.3] },
      },
      {
        title: "Identify Sacrospinous Ligament",
        description: "Identify the sacrospinous ligament (often blended with coccygeus muscle) from the ischial spine to the lateral sacrum. Place sutures 2cm MEDIAL to the ischial spine to avoid the pudendal neurovascular bundle that passes immediately posterior to the spine.",
        structures: ["Sacrospinous Ligament (R)", "Ischial Spine (R)", "Coccygeus (R)"],
        atRisk: ["Pudendal Nerve (S2-S4) (R)", "Internal Pudendal Artery (R)", "Sciatic Nerve (L4-S3)"],
        systems: ["fascia", "skeletal"],
        camera: { position: [4, 0, -2], target: [0.7, -0.2, -0.4] },
      },
      {
        title: "Vaginal Cuff Suspension",
        description: "Pass delayed absorbable or permanent sutures through the sacrospinous ligament 2cm medial to the spine, then through the vaginal cuff apex. When tied, this suspends the vaginal apex to the ligament, restoring Level I support with a slight posterior deviation.",
        structures: ["Vagina", "Sacrospinous Ligament (R)"],
        atRisk: [],
        systems: ["organs", "fascia"],
        camera: { position: [3, 1, 1], target: [0.4, -0.2, -0.2] },
      },
    ],
  },
  {
    id: "lymphadenectomy",
    name: "Pelvic Lymphadenectomy",
    shortName: "Lymphadenectomy",
    category: "Gynecologic Oncology",
    description: "Systematic removal of pelvic lymph nodes for cancer staging. Essential in cervical, endometrial, and vulvar cancer management.",
    steps: [
      {
        title: "External Iliac Chain",
        description: "Identify the external iliac vessels. Remove the lymph node package from lateral to medial along the vessels, from the circumflex iliac vein distally to the common iliac bifurcation proximally. Preserve the genitofemoral nerve on the psoas muscle.",
        structures: ["External Iliac Artery (L)", "External Iliac Artery (R)", "External Iliac Nodes"],
        atRisk: ["External Iliac Artery (L)", "External Iliac Artery (R)"],
        systems: ["arterial", "lymphatic"],
        camera: { position: [0, 3, 3], target: [0, 0.7, 0] },
      },
      {
        title: "Obturator Fossa",
        description: "Enter the obturator fossa. Identify and PRESERVE the obturator nerve — it runs through the fossa adjacent to the obturator nodes. Remove the obturator lymph node package. This is the MOST COMMON site of nodal metastasis in cervical cancer.",
        structures: ["Obturator Nodes", "Obturator Nerve (L2-L4) (L)", "Obturator Nerve (L2-L4) (R)", "Obturator Space"],
        atRisk: ["Obturator Nerve (L2-L4) (L)", "Obturator Nerve (L2-L4) (R)"],
        systems: ["lymphatic", "nervous", "spaces"],
        camera: { position: [-3, 1, 3], target: [-0.7, 0, 0.5] },
      },
      {
        title: "Internal Iliac Chain",
        description: "Remove lymph node tissue along the internal iliac vessels. Exercise extreme caution near the thin-walled internal iliac veins — venous injury during lymphadenectomy is a feared complication.",
        structures: ["Internal Iliac Artery (L)", "Internal Iliac Artery (R)", "Internal Iliac Nodes"],
        atRisk: ["Internal Iliac Vein (L)", "Internal Iliac Vein (R)"],
        systems: ["arterial", "lymphatic", "venous"],
        camera: { position: [-2, 2, -2], target: [0, 0.7, -0.4] },
      },
      {
        title: "Extended: Common Iliac & Para-aortic",
        description: "For advanced-stage cancers: continue dissection along the common iliac vessels to the aortic bifurcation. Para-aortic lymphadenectomy extends to the renal vessel level. The ureter crosses the common iliac bifurcation — identify and protect it.",
        structures: ["Common Iliac Nodes", "Para-aortic Nodes", "Common Iliac Artery (L)", "Common Iliac Artery (R)"],
        atRisk: ["Ureter (L)", "Ureter (R)"],
        systems: ["lymphatic", "arterial"],
        camera: { position: [0, 3, -2], target: [0, 1.5, -0.35] },
      },
    ],
  },
  {
    id: "radical-hysterectomy",
    name: "Radical Hysterectomy (Wertheim)",
    shortName: "Radical Hyst",
    category: "Gynecologic Oncology",
    description: "Extended resection of the uterus, parametria, upper vagina, and pelvic lymph nodes for early-stage cervical cancer. Requires meticulous identification of ureters and preservation of autonomic nerves.",
    steps: [
      {
        title: "Develop Pelvic Spaces",
        description: "Develop all four pelvic spaces: paravesical spaces (between bladder and obturator fossa) and pararectal spaces (between ureter and internal iliac artery). This isolates the parametrium as a 'bridge' between the spaces.",
        structures: ["Paravesical Space (L)", "Paravesical Space (R)", "Pararectal Space (L)", "Pararectal Space (R)"],
        atRisk: [],
        systems: ["spaces"],
        camera: { position: [3, 2, 2], target: [0, 0, 0] },
      },
      {
        title: "Ureter Dissection (Ureteral Tunnel)",
        description: "Unroof the ureter through the cardinal ligament ('ureteral tunnel'). Dissect the ureter completely free from its bed in the parametrium from the pelvic brim to its insertion into the bladder. This is the MOST CRITICAL step — ureteric injury rate is 1-3%.",
        structures: ["Ureter (L)", "Ureter (R)", "Cardinal Ligament (L)", "Cardinal Ligament (R)"],
        atRisk: ["Ureter (L)", "Ureter (R)"],
        systems: ["organs", "fascia"],
        camera: { position: [-3, 1, 2], target: [-0.3, 0, 0.1] },
      },
      {
        title: "Uterine Artery at Origin",
        description: "Ligate the uterine artery at its origin from the internal iliac artery (not at the uterine level as in simple hysterectomy). This provides wider parametrial resection and better hemostasis.",
        structures: ["Uterine Artery (L)", "Uterine Artery (R)", "Internal Iliac Artery (L)", "Internal Iliac Artery (R)"],
        atRisk: ["Ureter (L)", "Ureter (R)"],
        systems: ["arterial"],
        camera: { position: [-2, 2, -1], target: [-0.5, 0.5, -0.3] },
      },
      {
        title: "Parametrial Resection",
        description: "Resect the cardinal ligaments (parametria) widely to the pelvic sidewall. In nerve-sparing approaches, identify and preserve the inferior hypogastric plexus to maintain bladder function. Damage causes bladder atony requiring prolonged catheterization.",
        structures: ["Cardinal Ligament (L)", "Cardinal Ligament (R)"],
        atRisk: ["Inferior Hypogastric Plexus (L)", "Inferior Hypogastric Plexus (R)"],
        systems: ["fascia", "nervous"],
        camera: { position: [-3, 0, 1], target: [0, -0.1, 0] },
      },
      {
        title: "Uterosacral Ligament & Upper Vagina",
        description: "Divide the uterosacral ligaments at their sacral origin (not at the cervix as in simple hysterectomy). Resect the upper 2-3cm of vagina with the specimen. The vaginal margin is a critical oncologic boundary.",
        structures: ["Uterosacral Ligament (L)", "Uterosacral Ligament (R)", "Vagina", "Uterus", "Cervix"],
        atRisk: [],
        systems: ["fascia", "organs"],
        camera: { position: [0, 1, -4], target: [0, -0.1, -0.2] },
      },
    ],
  },
];
