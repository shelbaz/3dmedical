import { useMemo } from "react";
import * as THREE from "three";
import { Structure, SystemGroup, makeTube } from "./utils";

// ═══════════════════════════════════════════════════════════════
// ARTERIAL SYSTEM
// ═══════════════════════════════════════════════════════════════

export function ArterialSystem() {
  const r = 0.022; // standard artery radius
  const sm = 0.016; // small branch radius

  // Common iliac arteries (from aortic bifurcation)
  const commonIliacLGeo = useMemo(() => makeTube([[-0.05, 1.8, -0.4], [-0.25, 1.5, -0.38], [-0.5, 1.25, -0.35]], r * 1.4), []);
  const commonIliacRGeo = useMemo(() => makeTube([[0.05, 1.8, -0.4], [0.25, 1.5, -0.38], [0.5, 1.25, -0.35]], r * 1.4), []);

  // External iliac arteries (continue anterolaterally)
  const extIliacLGeo = useMemo(() => makeTube([[-0.5, 1.25, -0.35], [-0.65, 1.0, -0.1], [-0.8, 0.7, 0.15], [-0.95, 0.4, 0.45], [-1.1, 0.1, 0.7]], r * 1.2), []);
  const extIliacRGeo = useMemo(() => makeTube([[0.5, 1.25, -0.35], [0.65, 1.0, -0.1], [0.8, 0.7, 0.15], [0.95, 0.4, 0.45], [1.1, 0.1, 0.7]], r * 1.2), []);

  // Internal iliac arteries (descend into pelvis)
  const intIliacLGeo = useMemo(() => makeTube([[-0.5, 1.25, -0.35], [-0.6, 1.05, -0.45], [-0.65, 0.85, -0.5]], r * 1.1), []);
  const intIliacRGeo = useMemo(() => makeTube([[0.5, 1.25, -0.35], [0.6, 1.05, -0.45], [0.65, 0.85, -0.5]], r * 1.1), []);

  // --- Posterior Division Branches (Left) ---
  const supGlutealLGeo = useMemo(() => makeTube([[-0.65, 0.85, -0.5], [-0.8, 0.7, -0.6], [-1.0, 0.5, -0.7], [-1.15, 0.35, -0.8]], r), []);
  const latSacralLGeo = useMemo(() => makeTube([[-0.65, 0.85, -0.5], [-0.45, 0.65, -0.75], [-0.3, 0.4, -0.9], [-0.25, 0.1, -0.95]], sm), []);
  const iliolumbarLGeo = useMemo(() => makeTube([[-0.65, 0.85, -0.5], [-0.75, 1.0, -0.4], [-0.9, 1.2, -0.25], [-1.0, 1.4, -0.15]], sm), []);

  // --- Anterior Division Branches (Left) ---
  const uterineALGeo = useMemo(() => makeTube([[-0.65, 0.85, -0.5], [-0.55, 0.6, -0.3], [-0.4, 0.3, -0.1], [-0.3, 0.1, 0.05], [-0.2, -0.05, 0.1], [-0.12, -0.1, 0.12]], r), []);
  // Uterine artery ascending branch (tortuous along uterus)
  const uterineAscLGeo = useMemo(() => makeTube([[-0.12, -0.1, 0.12], [-0.15, 0.05, 0.18], [-0.18, 0.2, 0.2], [-0.2, 0.35, 0.2], [-0.22, 0.5, 0.18]], sm), []);

  const supVesicalLGeo = useMemo(() => makeTube([[-0.65, 0.85, -0.5], [-0.55, 0.65, -0.2], [-0.4, 0.4, 0.1], [-0.25, 0.2, 0.4], [-0.15, 0.05, 0.65]], sm), []);
  const vaginalALGeo = useMemo(() => makeTube([[-0.3, 0.1, 0.05], [-0.22, -0.1, 0.15], [-0.15, -0.3, 0.25], [-0.1, -0.5, 0.35]], sm), []);
  const obturatorALGeo = useMemo(() => makeTube([[-0.65, 0.85, -0.5], [-0.7, 0.65, -0.25], [-0.75, 0.4, 0.0], [-0.78, 0.1, 0.25], [-0.75, -0.15, 0.5], [-0.7, -0.3, 0.65]], sm), []);
  const midRectalALGeo = useMemo(() => makeTube([[-0.65, 0.85, -0.5], [-0.5, 0.55, -0.45], [-0.35, 0.25, -0.5], [-0.2, 0.0, -0.55], [-0.1, -0.2, -0.58]], sm), []);
  const intPudendalALGeo = useMemo(() => makeTube([
    [-0.65, 0.85, -0.5], [-0.75, 0.55, -0.6], [-0.85, 0.3, -0.65],
    [-0.9, 0.05, -0.55], [-0.88, -0.15, -0.35], [-0.85, -0.3, -0.15],
    [-0.8, -0.5, 0.0], [-0.7, -0.7, 0.15],
  ], r), []);
  const infGlutealALGeo = useMemo(() => makeTube([[-0.65, 0.85, -0.5], [-0.8, 0.6, -0.6], [-0.95, 0.35, -0.7], [-1.1, 0.15, -0.75]], r), []);

  // --- Mirror for Right Side ---
  const supGlutealRGeo = useMemo(() => makeTube([[0.65, 0.85, -0.5], [0.8, 0.7, -0.6], [1.0, 0.5, -0.7], [1.15, 0.35, -0.8]], r), []);
  const uterineARGeo = useMemo(() => makeTube([[0.65, 0.85, -0.5], [0.55, 0.6, -0.3], [0.4, 0.3, -0.1], [0.3, 0.1, 0.05], [0.2, -0.05, 0.1], [0.12, -0.1, 0.12]], r), []);
  const uterineAscRGeo = useMemo(() => makeTube([[0.12, -0.1, 0.12], [0.15, 0.05, 0.18], [0.18, 0.2, 0.2], [0.2, 0.35, 0.2], [0.22, 0.5, 0.18]], sm), []);
  const intPudendalARGeo = useMemo(() => makeTube([
    [0.65, 0.85, -0.5], [0.75, 0.55, -0.6], [0.85, 0.3, -0.65],
    [0.9, 0.05, -0.55], [0.88, -0.15, -0.35], [0.85, -0.3, -0.15],
    [0.8, -0.5, 0.0], [0.7, -0.7, 0.15],
  ], r), []);

  // Ovarian arteries (from aorta)
  const ovarianALGeo = useMemo(() => makeTube([[- 0.15, 2.2, -0.3], [-0.3, 1.8, -0.2], [-0.5, 1.4, -0.1], [-0.65, 1.1, 0.0], [-0.7, 0.8, 0.05], [-0.68, 0.5, 0.12], [-0.65, 0.32, 0.18]], sm), []);
  const ovarianARGeo = useMemo(() => makeTube([[0.15, 2.2, -0.3], [0.3, 1.8, -0.2], [0.5, 1.4, -0.1], [0.65, 1.1, 0.0], [0.7, 0.8, 0.05], [0.68, 0.5, 0.12], [0.65, 0.32, 0.18]], sm), []);

  // Median sacral artery
  const medianSacralGeo = useMemo(() => makeTube([[0, 1.8, -0.45], [0, 1.4, -0.7], [0, 1.0, -0.85], [0, 0.6, -0.95], [0, 0.2, -0.98], [0, -0.15, -0.96]], 0.012), []);

  // Superior rectal artery (from IMA)
  const supRectalGeo = useMemo(() => makeTube([[0, 2.0, -0.35], [0, 1.6, -0.4], [0, 1.2, -0.5], [0, 0.8, -0.55], [0, 0.5, -0.58]], sm), []);

  const red = "#dc2626";
  const darkRed = "#b91c1c";

  return (
    <SystemGroup system="arterial">
      {/* Major trunks */}
      <Structure name="Common Iliac Artery (L)" system="arterial" geometry={commonIliacLGeo} color={red} roughness={0.3} metalness={0.1} description="From aortic bifurcation (L4) to pelvic brim. Divides into external and internal iliac arteries at the sacroiliac joint." />
      <Structure name="Common Iliac Artery (R)" system="arterial" geometry={commonIliacRGeo} color={red} roughness={0.3} metalness={0.1} description="Right common iliac artery." />
      <Structure name="External Iliac Artery (L)" system="arterial" geometry={extIliacLGeo} color={red} roughness={0.3} metalness={0.1} description="Continues along pelvic brim to become femoral artery at inguinal ligament. Gives inferior epigastric and deep circumflex iliac branches." />
      <Structure name="External Iliac Artery (R)" system="arterial" geometry={extIliacRGeo} color={red} roughness={0.3} metalness={0.1} description="Right external iliac artery." />
      <Structure name="Internal Iliac Artery (L)" system="arterial" geometry={intIliacLGeo} color={red} roughness={0.3} metalness={0.1} description="Main arterial supply to pelvis. Divides into anterior and posterior divisions." clinicalSignificance="Anterior division ligation is a life-saving maneuver for intractable pelvic hemorrhage — reduces pulse pressure 85% distally." />
      <Structure name="Internal Iliac Artery (R)" system="arterial" geometry={intIliacRGeo} color={red} roughness={0.3} metalness={0.1} description="Right internal iliac artery." />

      {/* Posterior division */}
      <Structure name="Superior Gluteal Artery (L)" system="arterial" geometry={supGlutealLGeo} color={darkRed} roughness={0.3} description="Largest branch. Exits greater sciatic foramen ABOVE piriformis. Supplies gluteal muscles." />
      <Structure name="Superior Gluteal Artery (R)" system="arterial" geometry={supGlutealRGeo} color={darkRed} roughness={0.3} description="Right superior gluteal artery." />
      <Structure name="Lateral Sacral Artery (L)" system="arterial" geometry={latSacralLGeo} color={darkRed} roughness={0.3} description="Descends on sacral surface. Supplies sacral canal contents and erector spinae." />
      <Structure name="Iliolumbar Artery (L)" system="arterial" geometry={iliolumbarLGeo} color={darkRed} roughness={0.3} description="Ascends to iliac fossa. Supplies psoas, quadratus lumborum, iliacus." />

      {/* Anterior division */}
      <Structure name="Uterine Artery (L)" system="arterial" geometry={uterineALGeo} color={red} roughness={0.3} description="KEY gynecologic vessel. Crosses ureter SUPERIORLY ~1-2cm lateral to cervix ('water under the bridge')." clinicalSignificance="Must be ligated while preserving ureter during hysterectomy. Uterine artery embolization treats fibroids. Ascending branch forms arcuate → radial → spiral arteries." />
      <Structure name="Uterine Artery Ascending (L)" system="arterial" geometry={uterineAscLGeo} color={darkRed} roughness={0.3} description="Ascending branch of uterine artery. Runs along lateral uterus, anastomoses with ovarian artery at fundus." />
      <Structure name="Uterine Artery (R)" system="arterial" geometry={uterineARGeo} color={red} roughness={0.3} description="Right uterine artery." />
      <Structure name="Uterine Artery Ascending (R)" system="arterial" geometry={uterineAscRGeo} color={darkRed} roughness={0.3} description="Right ascending branch." />
      <Structure name="Superior Vesical Artery (L)" system="arterial" geometry={supVesicalLGeo} color={darkRed} roughness={0.3} description="From patent proximal umbilical artery. Supplies superior bladder." />
      <Structure name="Vaginal Artery (L)" system="arterial" geometry={vaginalALGeo} color={darkRed} roughness={0.3} description="Supplies vaginal walls. Forms azygos arteries (anterior and posterior longitudinal anastomotic channels)." />
      <Structure name="Obturator Artery (L)" system="arterial" geometry={obturatorALGeo} color={darkRed} roughness={0.3} description="Courses to obturator canal with obturator nerve and vein." clinicalSignificance="Corona mortis variant: anastomosis with inferior epigastric across superior pubic ramus (25-50% arterial). Severe hemorrhage if injured." />
      <Structure name="Middle Rectal Artery (L)" system="arterial" geometry={midRectalALGeo} color={darkRed} roughness={0.3} description="Supplies middle/lower rectum. Anastomoses with superior and inferior rectal arteries." />
      <Structure name="Internal Pudendal Artery (L)" system="arterial" geometry={intPudendalALGeo} color={red} roughness={0.3} description="Exits greater sciatic foramen below piriformis, hooks around ischial spine, enters Alcock's canal." clinicalSignificance="Branches: inferior rectal, perineal, artery of bulb, deep artery of clitoris, dorsal artery of clitoris. Main perineal blood supply." />
      <Structure name="Internal Pudendal Artery (R)" system="arterial" geometry={intPudendalARGeo} color={red} roughness={0.3} description="Right internal pudendal artery." />
      <Structure name="Inferior Gluteal Artery (L)" system="arterial" geometry={infGlutealALGeo} color={darkRed} roughness={0.3} description="Exits greater sciatic foramen below piriformis. Supplies gluteus maximus and hip." />

      {/* Other arteries */}
      <Structure name="Ovarian Artery (L)" system="arterial" geometry={ovarianALGeo} color={darkRed} roughness={0.3} description="Direct branch of aorta at L2. Descends in infundibulopelvic ligament to ovary." clinicalSignificance="Ureter crosses beneath the IP ligament — injury site during oophorectomy. Ovarian-uterine anastomosis provides collateral supply." />
      <Structure name="Ovarian Artery (R)" system="arterial" geometry={ovarianARGeo} color={darkRed} roughness={0.3} description="Right ovarian artery." />
      <Structure name="Median Sacral Artery" system="arterial" geometry={medianSacralGeo} color={darkRed} roughness={0.3} description="From posterior aorta at bifurcation. Descends midline over sacrum and coccyx." />
      <Structure name="Superior Rectal Artery" system="arterial" geometry={supRectalGeo} color={darkRed} roughness={0.3} description="Terminal branch of inferior mesenteric artery. Supplies upper rectum in the mesorectum." />
    </SystemGroup>
  );
}

// ═══════════════════════════════════════════════════════════════
// VENOUS SYSTEM
// ═══════════════════════════════════════════════════════════════

export function VenousSystem() {
  const v = 0.028;
  const sv = 0.02;

  const intIliacVeinLGeo = useMemo(() => makeTube([[-0.55, 0.85, -0.4], [-0.5, 1.1, -0.35], [-0.4, 1.3, -0.3]], v), []);
  const intIliacVeinRGeo = useMemo(() => makeTube([[0.55, 0.85, -0.4], [0.5, 1.1, -0.35], [0.4, 1.3, -0.3]], v), []);

  // Uterine venous plexus — network of small vessels
  const uterinePlexusGeo = useMemo(() => {
    const geos: THREE.TubeGeometry[] = [];
    const offsets = [[-0.18, 0], [0.18, 0], [-0.15, 0.15], [0.15, 0.15], [-0.12, -0.1], [0.12, -0.1]];
    for (const [ox, oy] of offsets) {
      geos.push(makeTube([
        [ox, -0.1 + oy, 0.15], [ox * 0.8, 0.1 + oy, 0.18], [ox * 0.6, 0.3 + oy, 0.2],
      ], 0.012));
    }
    const merged = new THREE.BufferGeometry();
    const positions: number[] = [];
    const normals: number[] = [];
    for (const g of geos) {
      const pos = g.getAttribute("position");
      const norm = g.getAttribute("normal");
      for (let i = 0; i < pos.count; i++) {
        positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
        normals.push(norm.getX(i), norm.getY(i), norm.getZ(i));
      }
      g.dispose();
    }
    merged.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    merged.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    return merged;
  }, []);

  // Presacral venous plexus — thin network on sacrum
  const presacralPlexusGeo = useMemo(() => {
    const geos: THREE.TubeGeometry[] = [];
    for (let i = 0; i < 6; i++) {
      const x = (Math.random() - 0.5) * 0.4;
      const y1 = 0.6 - i * 0.15;
      geos.push(makeTube([
        [x - 0.08, y1, -0.93], [x, y1 - 0.07, -0.95], [x + 0.08, y1 - 0.02, -0.93],
      ], 0.008));
    }
    const merged = new THREE.BufferGeometry();
    const positions: number[] = [];
    const normals: number[] = [];
    for (const g of geos) {
      const pos = g.getAttribute("position");
      const norm = g.getAttribute("normal");
      for (let i = 0; i < pos.count; i++) {
        positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
        normals.push(norm.getX(i), norm.getY(i), norm.getZ(i));
      }
      g.dispose();
    }
    merged.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    merged.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    return merged;
  }, []);

  const ovarianVeinLGeo = useMemo(() => makeTube([[-0.65, 0.32, 0.18], [-0.6, 0.6, 0.1], [-0.5, 1.0, 0.0], [-0.35, 1.5, -0.1], [-0.2, 2.0, -0.2]], sv), []);
  const ovarianVeinRGeo = useMemo(() => makeTube([[0.65, 0.32, 0.18], [0.6, 0.6, 0.1], [0.5, 1.0, 0.0], [0.35, 1.5, -0.1], [0.2, 2.0, -0.25]], sv), []);

  const blue = "#3b82f6";
  const darkBlue = "#2563eb";

  return (
    <SystemGroup system="venous">
      <Structure name="Internal Iliac Vein (L)" system="venous" geometry={intIliacVeinLGeo} color={blue} roughness={0.3} metalness={0.1} description="Main venous drainage of pelvis. Short, thin-walled, partially behind the artery." clinicalSignificance="Difficult to control when injured — thin walls, low pressure. Venous injury during lymphadenectomy is a feared complication." />
      <Structure name="Internal Iliac Vein (R)" system="venous" geometry={intIliacVeinRGeo} color={blue} roughness={0.3} metalness={0.1} description="Right internal iliac vein." />
      <Structure name="Uterine Venous Plexus" system="venous" geometry={uterinePlexusGeo} color="#60a5fa" roughness={0.3} description="Extensive plexus along lateral uterine walls in broad ligament. Drains to uterine veins → internal iliac vein." clinicalSignificance="Markedly engorged in pregnancy — source of hemorrhage during cesarean hysterectomy. Pelvic congestion syndrome involves varicosities of this plexus." />
      <Structure name="Presacral Venous Plexus" system="venous" geometry={presacralPlexusGeo} color={darkBlue} roughness={0.3} description="Thin-walled valveless basivertebral veins on anterior sacrum draining into anterior internal vertebral venous plexus." clinicalSignificance="Presacral hemorrhage is one of the MOST FEARED surgical emergencies. Veins retract into sacral foramina when torn. Managed with thumbtacks, muscle packing, or mesh tamponade." />
      <Structure name="Ovarian Vein (L)" system="venous" geometry={ovarianVeinLGeo} color={blue} roughness={0.3} description="Left ovarian vein drains to LEFT RENAL VEIN. Pampiniform plexus in broad ligament." clinicalSignificance="Incompetent valves cause pelvic congestion syndrome. Left side more commonly affected due to longer course and angle of renal vein entry." />
      <Structure name="Ovarian Vein (R)" system="venous" geometry={ovarianVeinRGeo} color={blue} roughness={0.3} description="Right ovarian vein drains DIRECTLY to IVC." />
    </SystemGroup>
  );
}

// ═══════════════════════════════════════════════════════════════
// NERVOUS SYSTEM
// ═══════════════════════════════════════════════════════════════

export function NervousSystem() {
  const n = 0.018;
  const sn = 0.012;

  // Sacral nerve roots S1-S5 emerging from anterior sacral foramina
  const sacralRootGeos = useMemo(() => {
    const roots: { geo: THREE.TubeGeometry; label: string; }[] = [];
    for (let i = 0; i < 5; i++) {
      const y = 0.7 - i * 0.22;
      roots.push({
        label: `S${i + 1}`,
        geo: makeTube([
          [0, y, -0.92],
          [-0.15, y - 0.02, -0.85],
          [-0.35, y - 0.05, -0.75],
          [-0.5, y - 0.08, -0.65],
        ], 0.01),
      });
    }
    return roots;
  }, []);

  // Sciatic nerve — large, exits below piriformis
  const sciaticLGeo = useMemo(() => makeTube([
    [-0.6, 0.2, -0.65], [-0.75, 0.05, -0.6], [-0.85, -0.15, -0.5],
    [-0.92, -0.35, -0.4], [-0.95, -0.55, -0.3], [-0.95, -0.8, -0.2],
  ], 0.03), []);

  // Pudendal nerve — around ischial spine through Alcock's canal
  const pudendalLGeo = useMemo(() => makeTube([
    [-0.55, 0.1, -0.65], [-0.7, -0.05, -0.6], [-0.82, -0.15, -0.45],
    [-0.88, -0.28, -0.25], [-0.85, -0.35, -0.1], [-0.8, -0.45, 0.05],
    [-0.75, -0.6, 0.15], [-0.65, -0.75, 0.2],
  ], n), []);
  const pudendalRGeo = useMemo(() => makeTube([
    [0.55, 0.1, -0.65], [0.7, -0.05, -0.6], [0.82, -0.15, -0.45],
    [0.88, -0.28, -0.25], [0.85, -0.35, -0.1], [0.8, -0.45, 0.05],
    [0.75, -0.6, 0.15], [0.65, -0.75, 0.2],
  ], n), []);

  // Obturator nerve — along lateral wall to obturator canal
  const obturatorLGeo = useMemo(() => makeTube([
    [-0.5, 0.9, -0.3], [-0.6, 0.7, -0.15], [-0.7, 0.45, 0.05],
    [-0.75, 0.2, 0.25], [-0.78, -0.05, 0.45], [-0.75, -0.25, 0.6],
  ], n), []);
  const obturatorRGeo = useMemo(() => makeTube([
    [0.5, 0.9, -0.3], [0.6, 0.7, -0.15], [0.7, 0.45, 0.05],
    [0.75, 0.2, 0.25], [0.78, -0.05, 0.45], [0.75, -0.25, 0.6],
  ], n), []);

  // Superior hypogastric plexus (presacral nerve)
  const supHypogastricGeo = useMemo(() => makeTube([
    [-0.08, 1.3, -0.55], [0, 1.15, -0.6], [0.08, 1.3, -0.55],
  ], 0.025), []);

  // Hypogastric nerves — descending to inferior hypogastric plexus
  const hypogastricLGeo = useMemo(() => makeTube([
    [-0.05, 1.15, -0.6], [-0.12, 0.9, -0.6], [-0.2, 0.6, -0.55],
    [-0.25, 0.3, -0.45], [-0.28, 0.05, -0.35], [-0.3, -0.15, -0.2],
  ], sn), []);
  const hypogastricRGeo = useMemo(() => makeTube([
    [0.05, 1.15, -0.6], [0.12, 0.9, -0.6], [0.2, 0.6, -0.55],
    [0.25, 0.3, -0.45], [0.28, 0.05, -0.35], [0.3, -0.15, -0.2],
  ], sn), []);

  // Pelvic splanchnic nerves (S2-S4)
  const pelvicSplanchnicLGeo = useMemo(() => makeTube([
    [-0.4, 0.3, -0.7], [-0.35, 0.15, -0.5], [-0.3, 0.0, -0.3],
    [-0.3, -0.1, -0.2],
  ], sn), []);

  // Inferior hypogastric plexus (pelvic plexus) — bilateral
  // Represented as a small plexiform structure near the cervix

  const yellow = "#eab308";
  const darkYellow = "#ca8a04";
  const nerve = "#d4a017";

  return (
    <SystemGroup system="nervous">
      {/* Sacral nerve roots */}
      {sacralRootGeos.map(({ geo, label }) => (
        <Structure key={label} name={`Sacral Root ${label}`} system="nervous" geometry={geo} color={darkYellow} roughness={0.4} description={`Ventral ramus of ${label} emerging from anterior sacral foramen.`} />
      ))}

      <Structure name="Sciatic Nerve (L4-S3)" system="nervous" geometry={sciaticLGeo} color={yellow} roughness={0.4} description="Largest nerve in the body. Exits below piriformis through greater sciatic foramen." clinicalSignificance="At risk during sacrospinous ligament fixation, deep pelvic dissection, and hip arthroplasty." />

      <Structure name="Pudendal Nerve (S2-S4) (L)" system="nervous" geometry={pudendalLGeo} color={yellow} roughness={0.4} description="Exits greater sciatic foramen below piriformis, wraps around ischial spine, enters Alcock's canal. Branches: inferior rectal, perineal, dorsal nerve of clitoris." clinicalSignificance="Block at ischial spine for perineal anesthesia. At risk during sacrospinous ligament fixation. Damage causes fecal/urinary incontinence and loss of perineal sensation." />
      <Structure name="Pudendal Nerve (S2-S4) (R)" system="nervous" geometry={pudendalRGeo} color={yellow} roughness={0.4} description="Right pudendal nerve." />

      <Structure name="Obturator Nerve (L2-L4) (L)" system="nervous" geometry={obturatorLGeo} color={nerve} roughness={0.4} description="Descends along lateral pelvic wall to obturator canal. Supplies adductor muscles and medial thigh skin." clinicalSignificance="At risk during pelvic lymphadenectomy (runs through obturator fossa adjacent to obturator nodes) and TOT sling. Obturator reflex during TURBT." />
      <Structure name="Obturator Nerve (L2-L4) (R)" system="nervous" geometry={obturatorRGeo} color={nerve} roughness={0.4} description="Right obturator nerve." />

      <Structure name="Superior Hypogastric Plexus" system="nervous" geometry={supHypogastricGeo} color={darkYellow} roughness={0.4} description="Presacral nerve. Anterior to L5/sacral promontory between common iliac arteries. Receives lumbar splanchnic nerves, divides into right and left hypogastric nerves." clinicalSignificance="Presacral neurectomy for central dysmenorrhea. At risk during presacral dissection for rectal surgery and sacrocolpopexy." />

      <Structure name="Hypogastric Nerve (L)" system="nervous" geometry={hypogastricLGeo} color={darkYellow} roughness={0.4} description="Sympathetic. Connects superior to inferior hypogastric plexus. Descends along lateral pelvic wall in uterosacral ligament fibers." />
      <Structure name="Hypogastric Nerve (R)" system="nervous" geometry={hypogastricRGeo} color={darkYellow} roughness={0.4} description="Right hypogastric nerve." />

      <Structure name="Pelvic Splanchnic Nerves (L)" system="nervous" geometry={pelvicSplanchnicLGeo} color={nerve} roughness={0.4} description="Parasympathetic from S2-S4. 'Nervi erigentes'. Join inferior hypogastric plexus." clinicalSignificance="Preservation ESSENTIAL for postoperative bladder function and sexual function. Injured during parametrial resection in radical hysterectomy and lateral rectal dissection." />

      <Structure name="Inferior Hypogastric Plexus (L)" system="nervous" position={[-0.3, -0.15, -0.18]} color={darkYellow} opacity={0.7} roughness={0.4} description="Bilateral pelvic plexus near cervix/vaginal fornix. Receives hypogastric nerves (sympathetic), pelvic splanchnic nerves (parasympathetic S2-S4). Gives uterovaginal (Frankenhauser's), vesical, and rectal plexuses." clinicalSignificance="MOST CRITICAL neural structure at risk during radical hysterectomy. Damage causes bladder atony, loss of rectal motility, sexual dysfunction. Nerve-sparing techniques aim to preserve it.">
        <sphereGeometry args={[0.08, 12, 12]} />
      </Structure>
      <Structure name="Inferior Hypogastric Plexus (R)" system="nervous" position={[0.3, -0.15, -0.18]} color={darkYellow} opacity={0.7} roughness={0.4} description="Right inferior hypogastric plexus.">
        <sphereGeometry args={[0.08, 12, 12]} />
      </Structure>
    </SystemGroup>
  );
}

// ═══════════════════════════════════════════════════════════════
// LYMPHATIC SYSTEM
// ═══════════════════════════════════════════════════════════════

// NodeChain at module scope to avoid unmount/remount on re-render
function NodeChain({ name, system, positions, color, description, clinicalSignificance }: {
  name: string;
  system: "lymphatic";
  positions: [number, number, number][];
  color: string;
  description?: string;
  clinicalSignificance?: string;
}) {
  return (
    <>
      {positions.map((pos, i) => (
        <Structure key={i} name={i === 0 ? name : `${name} (${i + 1})`} system={system} position={pos} color={color} roughness={0.5} description={i === 0 ? description : undefined} clinicalSignificance={i === 0 ? clinicalSignificance : undefined}>
          <sphereGeometry args={[0.04, 10, 10]} />
        </Structure>
      ))}
    </>
  );
}

export function LymphaticSystem() {
  const green = "#22c55e";
  const darkGreen = "#16a34a";

  return (
    <SystemGroup system="lymphatic">
      <NodeChain name="External Iliac Nodes" system="lymphatic" color={green} positions={[[-0.75, 0.9, 0.0], [-0.8, 0.7, 0.1], [-0.85, 0.5, 0.2], [0.75, 0.9, 0.0], [0.8, 0.7, 0.1], [0.85, 0.5, 0.2]]} description="Along external iliac vessels. Drain upper bladder, upper vagina, cervix, uterine body." clinicalSignificance="Part of standard pelvic lymphadenectomy for cervical and endometrial cancer staging." />

      <NodeChain name="Obturator Nodes" system="lymphatic" color={green} positions={[[-0.75, 0.05, 0.5], [-0.72, -0.15, 0.55], [0.75, 0.05, 0.5], [0.72, -0.15, 0.55]]} description="Within obturator fossa. MOST COMMON site of nodal metastasis in cervical cancer." clinicalSignificance="First nodes removed in pelvic lymphadenectomy. Sentinel node region for cervical cancer. Obturator nerve runs immediately through this space." />

      <NodeChain name="Internal Iliac Nodes" system="lymphatic" color={darkGreen} positions={[[-0.6, 0.7, -0.4], [-0.55, 0.5, -0.35], [0.6, 0.7, -0.4], [0.55, 0.5, -0.35]]} description="Along internal iliac vessels. Drain pelvic viscera including cervix, lower uterus, upper vagina, rectum." />

      <NodeChain name="Common Iliac Nodes" system="lymphatic" color={darkGreen} positions={[[-0.35, 1.35, -0.35], [-0.25, 1.5, -0.38], [0.35, 1.35, -0.35], [0.25, 1.5, -0.38]]} description="Along common iliac vessels. Receive from external and internal iliac nodes." />

      <NodeChain name="Presacral Nodes" system="lymphatic" color={darkGreen} positions={[[-0.08, 0.6, -0.9], [0.08, 0.35, -0.92], [0, 0.1, -0.94]]} description="Anterior to sacrum. Drain rectum, posterior cervix." clinicalSignificance="Important in rectal and cervical cancer staging. Near presacral venous plexus — hemorrhage risk during dissection." />

      <NodeChain name="Para-aortic Nodes" system="lymphatic" color={green} positions={[[-0.12, 2.0, -0.35], [0.12, 2.15, -0.35], [-0.1, 2.3, -0.3], [0.1, 2.45, -0.3]]} description="Along aorta/IVC from bifurcation to renal vessels. Direct drainage for ovarian cancer via ovarian vessels." clinicalSignificance="Extended lymphadenectomy target in advanced cervical/endometrial cancer. Ovarian cancer staging requires para-aortic assessment." />

      <NodeChain name="Superficial Inguinal Nodes" system="lymphatic" color={green} positions={[[-0.9, -0.3, 1.0], [-0.8, -0.4, 1.05], [-0.7, -0.5, 1.0], [0.9, -0.3, 1.0], [0.8, -0.4, 1.05], [0.7, -0.5, 1.0]]} description="Below inguinal ligament in femoral triangle. Drain vulva, lower vagina, perineum, perianal skin." clinicalSignificance="Sentinel nodes for vulvar cancer. Inguinal lymphadenectomy for vulvar SCC staging. Bilateral dissection for midline lesions." />
    </SystemGroup>
  );
}
