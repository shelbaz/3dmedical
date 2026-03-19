import { useMemo } from "react";
import * as THREE from "three";
import { Structure, SystemGroup, makeTube, makeExtruded, makeEllipseRing } from "./utils";

// ═══════════════════════════════════════════════════════════════
// SKELETAL SYSTEM
// ═══════════════════════════════════════════════════════════════

export function SkeletalSystem() {
  // Pelvic brim — the defining ring of the pelvis
  const brimGeo = useMemo(() => makeEllipseRing(1.25, 0.9, 0.045), []);

  // Iliac wing (left) — fan-shaped plate
  const iliacWingLGeo = useMemo(
    () =>
      makeExtruded(
        (s) => {
          s.moveTo(0, 0);
          s.bezierCurveTo(0.15, 0.4, 0.35, 0.8, 0.3, 1.2);
          s.bezierCurveTo(0.15, 1.5, -0.25, 1.45, -0.4, 1.2);
          s.bezierCurveTo(-0.55, 0.85, -0.45, 0.35, -0.15, 0.1);
          s.lineTo(0, 0);
        },
        0.07,
        true
      ),
    []
  );

  // Sacrum — curved triangular plate
  const sacrumGeo = useMemo(
    () =>
      makeExtruded(
        (s) => {
          s.moveTo(-0.38, 0);
          s.lineTo(0.38, 0);
          s.bezierCurveTo(0.28, -0.35, 0.18, -0.65, 0.08, -0.85);
          s.lineTo(-0.08, -0.85);
          s.bezierCurveTo(-0.18, -0.65, -0.28, -0.35, -0.38, 0);
        },
        0.18,
        true
      ),
    []
  );

  // Coccyx
  const coccyxGeo = useMemo(
    () =>
      makeExtruded(
        (s) => {
          s.moveTo(-0.06, 0);
          s.lineTo(0.06, 0);
          s.lineTo(0.02, -0.25);
          s.lineTo(-0.02, -0.25);
          s.lineTo(-0.06, 0);
        },
        0.08,
        true
      ),
    []
  );

  // Superior pubic rami — curved bars connecting ilium to symphysis
  const supPubicRamusLGeo = useMemo(
    () =>
      makeTube(
        [
          [-0.85, -0.1, 0.55],
          [-0.6, -0.2, 0.85],
          [-0.35, -0.25, 1.1],
          [-0.1, -0.25, 1.25],
        ],
        0.055
      ),
    []
  );
  const supPubicRamusRGeo = useMemo(
    () =>
      makeTube(
        [
          [0.85, -0.1, 0.55],
          [0.6, -0.2, 0.85],
          [0.35, -0.25, 1.1],
          [0.1, -0.25, 1.25],
        ],
        0.055
      ),
    []
  );

  // Inferior pubic rami — from symphysis down to ischial tuberosity
  const infPubicRamusLGeo = useMemo(
    () =>
      makeTube(
        [
          [-0.08, -0.35, 1.25],
          [-0.2, -0.55, 1.1],
          [-0.4, -0.75, 0.85],
          [-0.6, -0.9, 0.6],
          [-0.75, -0.95, 0.35],
        ],
        0.05
      ),
    []
  );
  const infPubicRamusRGeo = useMemo(
    () =>
      makeTube(
        [
          [0.08, -0.35, 1.25],
          [0.2, -0.55, 1.1],
          [0.4, -0.75, 0.85],
          [0.6, -0.9, 0.6],
          [0.75, -0.95, 0.35],
        ],
        0.05
      ),
    []
  );

  // Ischial rami — posterior connection from tuberosity to ilium
  const ischialBodyLGeo = useMemo(
    () =>
      makeTube(
        [
          [-0.75, -0.95, 0.35],
          [-0.85, -0.8, 0.05],
          [-0.9, -0.55, -0.15],
          [-0.95, -0.25, -0.25],
          [-0.9, 0.0, -0.2],
        ],
        0.06
      ),
    []
  );
  const ischialBodyRGeo = useMemo(
    () =>
      makeTube(
        [
          [0.75, -0.95, 0.35],
          [0.85, -0.8, 0.05],
          [0.9, -0.55, -0.15],
          [0.95, -0.25, -0.25],
          [0.9, 0.0, -0.2],
        ],
        0.06
      ),
    []
  );

  // Obturator foramen outline
  const obtForamenLGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 32; i++) {
      const t = (i / 32) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          -0.65 + 0.22 * Math.cos(t),
          -0.5 + 0.3 * Math.sin(t),
          0.65
        )
      );
    }
    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(pts, true), 32, 0.02, 6, true
    );
  }, []);
  const obtForamenRGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 32; i++) {
      const t = (i / 32) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          0.65 + 0.22 * Math.cos(t),
          -0.5 + 0.3 * Math.sin(t),
          0.65
        )
      );
    }
    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(pts, true), 32, 0.02, 6, true
    );
  }, []);

  const bone = "#e8dcc8";

  return (
    <SystemGroup system="skeletal">
      <Structure name="Pelvic Brim" system="skeletal" geometry={brimGeo} position={[0, 0.45, 0.1]} color={bone} roughness={0.75} description="The pelvic inlet — the ring-shaped boundary between the greater (false) and lesser (true) pelvis. Defined by the sacral promontory, arcuate lines, pectineal lines, and pubic crest." clinicalSignificance="Pelvic diameters (conjugate ~11cm, transverse ~13cm, oblique ~12.5cm) are assessed for obstetric adequacy. The plane of the inlet is tilted ~55° from horizontal." />

      <Structure name="Iliac Wing (L)" system="skeletal" geometry={iliacWingLGeo} position={[-0.95, 0.5, -0.05]} rotation={[0.15, 0.5, 0.1]} color={bone} roughness={0.75} description="Left iliac wing (ala). The broad, flat superior portion of the ilium. Medial (pelvic) surface is the iliac fossa. Contains the iliac crest superiorly with ASIS and PSIS landmarks." />
      <Structure name="Iliac Wing (R)" system="skeletal" geometry={iliacWingLGeo} position={[0.95, 0.5, -0.05]} rotation={[0.15, -0.5, -0.1]} scale={[-1, 1, 1]} color={bone} roughness={0.75} description="Right iliac wing." />

      <Structure name="Sacrum" system="skeletal" geometry={sacrumGeo} position={[0, 0.85, -0.95]} rotation={[0.3, 0, 0]} color={bone} roughness={0.75} description="Triangular bone formed by fusion of S1-S5. The sacral promontory (anterior S1) is a key obstetric landmark. Anterior foramina transmit sacral nerve ventral rami." clinicalSignificance="Anterior surface relates to presacral venous plexus. Fixation point for sacrocolpopexy. Sacral nerve roots S2-S4 provide parasympathetic innervation to pelvic viscera." />

      <Structure name="Coccyx" system="skeletal" geometry={coccyxGeo} position={[0, -0.05, -0.95]} rotation={[0.2, 0, 0]} color={bone} roughness={0.75} description="Terminal bone of the vertebral column, typically 3-5 fused segments." />

      <Structure name="Pubic Symphysis" system="skeletal" position={[0, -0.3, 1.3]} color={bone} roughness={0.75} description="Secondary cartilaginous joint between the two pubic bones. Contains a fibrocartilaginous interpubic disc." clinicalSignificance="Landmark for retropubic procedures (TVT, Burch colposuspension). Corona mortis crosses 40-96mm from the symphysis on the superior pubic ramus.">
        <boxGeometry args={[0.18, 0.25, 0.12]} />
      </Structure>

      <Structure name="Superior Pubic Ramus (L)" system="skeletal" geometry={supPubicRamusLGeo} color={bone} roughness={0.75} description="Connects the pubic body to the ilium. Forms the anterior portion of the pelvic brim." />
      <Structure name="Superior Pubic Ramus (R)" system="skeletal" geometry={supPubicRamusRGeo} color={bone} roughness={0.75} description="Right superior pubic ramus." />
      <Structure name="Inferior Pubic Ramus (L)" system="skeletal" geometry={infPubicRamusLGeo} color={bone} roughness={0.75} description="Descends from the pubic symphysis to join the ischial ramus, forming the pubic arch." />
      <Structure name="Inferior Pubic Ramus (R)" system="skeletal" geometry={infPubicRamusRGeo} color={bone} roughness={0.75} description="Right inferior pubic ramus." />
      <Structure name="Ischium (L)" system="skeletal" geometry={ischialBodyLGeo} color={bone} roughness={0.75} description="Left ischial body and ramus. Contains the ischial tuberosity (weight-bearing in sitting) and ischial spine (key surgical landmark)." />
      <Structure name="Ischium (R)" system="skeletal" geometry={ischialBodyRGeo} color={bone} roughness={0.75} description="Right ischium." />

      <Structure name="Ischial Spine (L)" system="skeletal" position={[-0.88, -0.3, -0.22]} color="#d4c8b0" roughness={0.7} description="Pointed projection on the posterior-medial ischium. The narrowest transverse diameter of the pelvic outlet is between the ischial spines (~10.5cm)." clinicalSignificance="THE critical landmark for pudendal nerve block, sacrospinous ligament fixation, and assessing station during labor. The pudendal nerve and internal pudendal vessels pass immediately posterior to it.">
        <sphereGeometry args={[0.06, 12, 12]} />
      </Structure>
      <Structure name="Ischial Spine (R)" system="skeletal" position={[0.88, -0.3, -0.22]} color="#d4c8b0" roughness={0.7} description="Right ischial spine.">
        <sphereGeometry args={[0.06, 12, 12]} />
      </Structure>

      <Structure name="Ischial Tuberosity (L)" system="skeletal" position={[-0.78, -0.95, 0.25]} color="#d4c8b0" roughness={0.7} description="Large bony prominence of the inferior ischium. Weight-bearing in sitting. Origin of hamstring muscles and sacrotuberous ligament attachment.">
        <sphereGeometry args={[0.1, 12, 12]} />
      </Structure>
      <Structure name="Ischial Tuberosity (R)" system="skeletal" position={[0.78, -0.95, 0.25]} color="#d4c8b0" roughness={0.7} description="Right ischial tuberosity.">
        <sphereGeometry args={[0.1, 12, 12]} />
      </Structure>

      <Structure name="Obturator Foramen (L)" system="skeletal" geometry={obtForamenLGeo} color="#d4c8b0" roughness={0.7} description="Large opening in the os coxae, covered by the obturator membrane. The obturator canal at its superolateral margin transmits the obturator nerve and vessels." />
      <Structure name="Obturator Foramen (R)" system="skeletal" geometry={obtForamenRGeo} color="#d4c8b0" roughness={0.7} description="Right obturator foramen." />
    </SystemGroup>
  );
}

// ═══════════════════════════════════════════════════════════════
// MUSCULAR SYSTEM
// ═══════════════════════════════════════════════════════════════

export function MuscularSystem() {
  // Levator Ani — funnel/hammock shape with central hiatus
  const levatorAniGeo = useMemo(() => {
    const profile = [
      new THREE.Vector2(0.12, 0.02),
      new THREE.Vector2(0.18, -0.02),
      new THREE.Vector2(0.3, -0.06),
      new THREE.Vector2(0.5, -0.1),
      new THREE.Vector2(0.7, -0.12),
      new THREE.Vector2(0.85, -0.08),
      new THREE.Vector2(0.95, 0.0),
      new THREE.Vector2(1.0, 0.05),
    ];
    return new THREE.LatheGeometry(profile, 36);
  }, []);

  // Coccygeus — small triangular muscle
  const coccygeusGeo = useMemo(
    () =>
      makeExtruded(
        (s) => {
          s.moveTo(0, 0);
          s.lineTo(0.5, 0.15);
          s.lineTo(0.5, -0.15);
          s.lineTo(0, 0);
        },
        0.04
      ),
    []
  );

  // Piriformis — triangular on posterior wall
  const piriformisGeo = useMemo(
    () =>
      makeExtruded(
        (s) => {
          s.moveTo(0, 0);
          s.bezierCurveTo(0.15, 0.12, 0.5, 0.15, 0.7, 0.08);
          s.lineTo(0.7, -0.08);
          s.bezierCurveTo(0.5, -0.15, 0.15, -0.12, 0, 0);
        },
        0.06
      ),
    []
  );

  // Obturator internus — curved plate on lateral wall
  const obtIntGeo = useMemo(
    () =>
      makeExtruded(
        (s) => {
          s.moveTo(0, 0);
          s.lineTo(0, 0.6);
          s.bezierCurveTo(0.05, 0.65, 0.35, 0.65, 0.4, 0.6);
          s.lineTo(0.4, 0);
          s.lineTo(0, 0);
        },
        0.04
      ),
    []
  );

  const muscle = "#c44040";
  const deepMuscle = "#a83535";

  return (
    <SystemGroup system="muscular">
      <Structure name="Levator Ani" system="muscular" geometry={levatorAniGeo} position={[0, -0.6, 0.05]} color={muscle} roughness={0.55} opacity={0.85} description="The primary muscle of the pelvic floor forming a funnel-shaped diaphragm. Composed of pubococcygeus (pubovaginalis, puboperinealis, puboanalis), puborectalis, and iliococcygeus. The central hiatus transmits the urethra, vagina, and rectum." clinicalSignificance="The levator hiatus is the primary site of weakness in pelvic organ prolapse. Avulsion from the pubic bone occurs in ~36% of vaginal deliveries. The iliococcygeus forms the levator plate — the horizontal shelf supporting pelvic organs." />

      <Structure name="Coccygeus (L)" system="muscular" geometry={coccygeusGeo} position={[-0.55, -0.35, -0.6]} rotation={[0.1, 0.6, 0.15]} color={deepMuscle} roughness={0.55} description="From ischial spine to lateral sacrum/coccyx (S4-S5). Posterior to levator ani. Often partially tendinous, blending with the sacrospinous ligament." />
      <Structure name="Coccygeus (R)" system="muscular" geometry={coccygeusGeo} position={[0.55, -0.35, -0.6]} rotation={[0.1, -0.6, -0.15]} scale={[-1, 1, 1]} color={deepMuscle} roughness={0.55} description="Right coccygeus." />

      <Structure name="Piriformis" system="muscular" geometry={piriformisGeo} position={[-0.15, 0.35, -0.85]} rotation={[0.5, 0, 0]} color={deepMuscle} roughness={0.55} description="Origin: anterior sacrum (S2-S4). Exits through greater sciatic foramen. Divides the foramen into suprapiriform and infrapiriform spaces." clinicalSignificance="Sciatic nerve exits BELOW piriformis (~88%). Superior gluteal nerve/vessels pass ABOVE it. Pudendal nerve exits below it. Piriformis syndrome: sciatic nerve compression variant." />

      <Structure name="Obturator Internus (L)" system="muscular" geometry={obtIntGeo} position={[-0.95, -0.55, 0.35]} rotation={[0, 0.3, 0]} color="#b83838" roughness={0.55} description="Pelvic wall muscle. Its fascia gives rise to the ATLA, ATFP (white line), and forms Alcock's canal (pudendal canal)." clinicalSignificance="The ATFP (white line) is the lateral attachment of the pubocervical fascia — detachment causes paravaginal defect (lateral cystocele). Alcock's canal on its medial surface contains the pudendal neurovascular bundle." />
      <Structure name="Obturator Internus (R)" system="muscular" geometry={obtIntGeo} position={[0.95, -0.55, 0.35]} rotation={[0, -0.3, 0]} scale={[-1, 1, 1]} color="#b83838" roughness={0.55} description="Right obturator internus." />

      {/* Perineal muscles */}
      <Structure name="External Anal Sphincter" system="muscular" position={[0, -1.0, -0.45]} rotation={[Math.PI / 2, 0, 0]} color={deepMuscle} roughness={0.55} description="Voluntary skeletal muscle surrounding the anal canal. Three parts: subcutaneous, superficial (perineal body to anococcygeal ligament), and deep (blends with puborectalis)." clinicalSignificance="Third/fourth degree perineal tears involve this sphincter. The intersphincteric plane between internal and external sphincters is the surgical plane for intersphincteric resection.">
        <torusGeometry args={[0.1, 0.035, 12, 24]} />
      </Structure>

      <Structure name="External Urethral Sphincter" system="muscular" position={[0, -0.85, 0.65]} rotation={[Math.PI / 2, 0, 0]} color={muscle} roughness={0.55} description="Voluntary rhabdosphincter complex: sphincter urethrae, compressor urethrae, urethrovaginal sphincter." clinicalSignificance="Primary voluntary urinary continence mechanism. Mid-urethral slings (TVT, TOT) provide support under this sphincter.">
        <torusGeometry args={[0.06, 0.025, 12, 24]} />
      </Structure>

      <Structure name="Perineal Body" system="muscular" position={[0, -1.05, 0.05]} color="#d45050" roughness={0.6} description="Fibromuscular node (central tendon of perineum) between vagina and anus. Convergence of: bulbospongiosus, transverse perineal muscles, external anal sphincter, levator ani (puboperinealis), rectovaginal fascia." clinicalSignificance="CRITICAL keystone of pelvic floor support. Disruption during obstetric injury causes widened genital hiatus and prolapse. Site of episiotomy. Perineorrhaphy is key to posterior prolapse repair.">
        <sphereGeometry args={[0.06, 12, 12]} />
      </Structure>

      <Structure name="Perineal Membrane" system="muscular" position={[0, -0.95, 0.55]} rotation={[0.15, 0, 0]} color="#c44040" opacity={0.5} roughness={0.55} description="Triangular fibrous sheet spanning between the ischiopubic rami. Supports urethra and vagina. Part of DeLancey Level III support.">
        <planeGeometry args={[0.9, 0.5]} />
      </Structure>
    </SystemGroup>
  );
}

// ═══════════════════════════════════════════════════════════════
// FASCIA & LIGAMENTS SYSTEM
// ═══════════════════════════════════════════════════════════════

export function FasciaSystem() {
  // Cardinal ligaments — fan-shaped from cervix to sidewall
  const cardinalLGeo = useMemo(
    () =>
      makeExtruded(
        (s) => {
          s.moveTo(0, 0);
          s.lineTo(-0.65, 0.1);
          s.lineTo(-0.65, -0.1);
          s.lineTo(0, -0.05);
          s.lineTo(0, 0);
        },
        0.04
      ),
    []
  );

  // Uterosacral ligaments — curved bands from cervix to sacrum
  const uterosacralLGeo = useMemo(
    () =>
      makeTube(
        [
          [-0.08, -0.15, 0.0],
          [-0.15, -0.05, -0.25],
          [-0.2, 0.1, -0.5],
          [-0.18, 0.3, -0.7],
          [-0.12, 0.5, -0.85],
        ],
        0.035
      ),
    []
  );
  const uterosacralRGeo = useMemo(
    () =>
      makeTube(
        [
          [0.08, -0.15, 0.0],
          [0.15, -0.05, -0.25],
          [0.2, 0.1, -0.5],
          [0.18, 0.3, -0.7],
          [0.12, 0.5, -0.85],
        ],
        0.035
      ),
    []
  );

  // Round ligaments — from uterine cornua anterolaterally
  const roundLigLGeo = useMemo(
    () =>
      makeTube(
        [
          [-0.25, 0.35, 0.2],
          [-0.45, 0.3, 0.5],
          [-0.7, 0.2, 0.8],
          [-0.9, 0.1, 1.0],
          [-1.0, 0.0, 1.1],
        ],
        0.025
      ),
    []
  );
  const roundLigRGeo = useMemo(
    () =>
      makeTube(
        [
          [0.25, 0.35, 0.2],
          [0.45, 0.3, 0.5],
          [0.7, 0.2, 0.8],
          [0.9, 0.1, 1.0],
          [1.0, 0.0, 1.1],
        ],
        0.025
      ),
    []
  );

  // Sacrospinous ligament — from lateral sacrum to ischial spine
  const sacrospinousLGeo = useMemo(
    () =>
      makeTube(
        [
          [-0.15, 0.0, -0.9],
          [-0.4, -0.1, -0.7],
          [-0.65, -0.2, -0.45],
          [-0.88, -0.3, -0.22],
        ],
        0.04
      ),
    []
  );
  const sacrospinousRGeo = useMemo(
    () =>
      makeTube(
        [
          [0.15, 0.0, -0.9],
          [0.4, -0.1, -0.7],
          [0.65, -0.2, -0.45],
          [0.88, -0.3, -0.22],
        ],
        0.04
      ),
    []
  );

  // Sacrotuberous ligament
  const sacrotuberousLGeo = useMemo(
    () =>
      makeTube(
        [
          [-0.1, 0.2, -0.95],
          [-0.35, -0.05, -0.8],
          [-0.55, -0.35, -0.55],
          [-0.7, -0.65, -0.2],
          [-0.78, -0.9, 0.15],
        ],
        0.04
      ),
    []
  );
  const sacrotuberousRGeo = useMemo(
    () =>
      makeTube(
        [
          [0.1, 0.2, -0.95],
          [0.35, -0.05, -0.8],
          [0.55, -0.35, -0.55],
          [0.7, -0.65, -0.2],
          [0.78, -0.9, 0.15],
        ],
        0.04
      ),
    []
  );

  // Broad ligament — peritoneal sheet
  const broadLigLGeo = useMemo(
    () =>
      makeExtruded(
        (s) => {
          s.moveTo(0, -0.15);
          s.lineTo(0, 0.45);
          s.lineTo(-0.6, 0.3);
          s.lineTo(-0.6, -0.05);
          s.lineTo(0, -0.15);
        },
        0.015
      ),
    []
  );

  // Infundibulopelvic ligament — to ovary
  const ipLigLGeo = useMemo(
    () =>
      makeTube(
        [
          [-0.7, 0.3, 0.15],
          [-0.85, 0.45, 0.0],
          [-1.0, 0.65, -0.15],
          [-1.05, 0.85, -0.3],
        ],
        0.025
      ),
    []
  );
  const ipLigRGeo = useMemo(
    () =>
      makeTube(
        [
          [0.7, 0.3, 0.15],
          [0.85, 0.45, 0.0],
          [1.0, 0.65, -0.15],
          [1.05, 0.85, -0.3],
        ],
        0.025
      ),
    []
  );

  const fascia = "#a78bfa";
  const lig = "#8b5cf6";
  const peritoneum = "#c4b5fd";

  return (
    <SystemGroup system="fascia">
      <Structure name="Cardinal Ligament (L)" system="fascia" geometry={cardinalLGeo} position={[-0.05, -0.1, 0.05]} rotation={[0, 0.1, 0]} color={fascia} opacity={0.7} roughness={0.6} description="Fan-shaped condensation of parametrium (Mackenrodt's ligament). From lateral cervix to pelvic sidewall. Contains: uterine artery/vein, ureter, parametrial nodes, autonomic nerves." clinicalSignificance="PRIMARY Level I support (DeLancey). Resected in radical hysterectomy. The ureter passes through it ('ureteral tunnel') and must be dissected free." />
      <Structure name="Cardinal Ligament (R)" system="fascia" geometry={cardinalLGeo} position={[0.05, -0.1, 0.05]} rotation={[0, Math.PI - 0.1, 0]} color={fascia} opacity={0.7} roughness={0.6} description="Right cardinal ligament." />

      <Structure name="Uterosacral Ligament (L)" system="fascia" geometry={uterosacralLGeo} color={lig} roughness={0.55} description="From posterolateral cervix to sacral periosteum (S2-S4). Contains hypogastric nerve fibers." clinicalSignificance="Level I support. Used in uterosacral ligament suspension (McCall culdoplasty). Ureter passes 0.9-2.3cm lateral to it — risk of kinking during suspension." />
      <Structure name="Uterosacral Ligament (R)" system="fascia" geometry={uterosacralRGeo} color={lig} roughness={0.55} description="Right uterosacral ligament." />

      <Structure name="Round Ligament (L)" system="fascia" geometry={roundLigLGeo} color={peritoneum} roughness={0.6} description="From uterine cornu anterolaterally through the broad ligament, inguinal canal, to labia majora. Contains artery of Sampson." />
      <Structure name="Round Ligament (R)" system="fascia" geometry={roundLigRGeo} color={peritoneum} roughness={0.6} description="Right round ligament." />

      <Structure name="Sacrospinous Ligament (L)" system="fascia" geometry={sacrospinousLGeo} color={lig} roughness={0.55} description="From lateral sacrum/coccyx to ischial spine. Pudendal nerve and internal pudendal vessels wrap around its posterior surface at the ischial spine." clinicalSignificance="Used for sacrospinous ligament fixation (SSLF) for vault prolapse. Suture placed 2cm medial to ischial spine to avoid pudendal nerve. Sciatic nerve lies immediately posterior." />
      <Structure name="Sacrospinous Ligament (R)" system="fascia" geometry={sacrospinousRGeo} color={lig} roughness={0.55} description="Right sacrospinous ligament." />

      <Structure name="Sacrotuberous Ligament (L)" system="fascia" geometry={sacrotuberousLGeo} color={lig} roughness={0.55} description="From posterior sacrum/coccyx to ischial tuberosity. Forms posterior border of lesser sciatic foramen. Pudendal nerve runs between sacrospinous and sacrotuberous ligaments." />
      <Structure name="Sacrotuberous Ligament (R)" system="fascia" geometry={sacrotuberousRGeo} color={lig} roughness={0.55} description="Right sacrotuberous ligament." />

      <Structure name="Broad Ligament (L)" system="fascia" geometry={broadLigLGeo} position={[-0.05, 0.05, 0.15]} rotation={[0.1, 0, 0]} color={peritoneum} opacity={0.35} roughness={0.7} description="Double peritoneal fold from lateral uterus to sidewall. Contains uterine vessels, round ligament, ovarian ligament, ureter (at base). Subdivisions: mesometrium, mesosalpinx, mesovarium." />
      <Structure name="Broad Ligament (R)" system="fascia" geometry={broadLigLGeo} position={[0.05, 0.05, 0.15]} rotation={[0.1, Math.PI, 0]} color={peritoneum} opacity={0.35} roughness={0.7} description="Right broad ligament." />

      <Structure name="Infundibulopelvic Ligament (L)" system="fascia" geometry={ipLigLGeo} color={peritoneum} roughness={0.6} description="Suspensory ligament of the ovary. Contains ovarian artery, vein, lymphatics, and nerve plexus." clinicalSignificance="Must be ligated during oophorectomy. Ureter courses beneath it at the pelvic brim — one of three classic sites of ureteric injury." />
      <Structure name="Infundibulopelvic Ligament (R)" system="fascia" geometry={ipLigRGeo} color={peritoneum} roughness={0.6} description="Right infundibulopelvic ligament." />
    </SystemGroup>
  );
}
