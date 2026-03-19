import { useEffect, useMemo, useRef, useContext, memo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useAppStore } from "../../store/useAppStore";
import { useShallow } from "zustand/shallow";
import { meshRegistry, ClippingPlanesContext } from "./utils";
import type { AnatomicalSystem } from "../../types/anatomy";

const WARNING_COLOR = new THREE.Color("#ef4444");
const BLACK = new THREE.Color("#000000");

// ─── Mesh-to-structure mapping by index ────────────────────
// Derived from MRI model "Bony Pelvis, Supply, Organs from MRI"
// Positions analyzed to identify anatomical structures.

interface StructureMapping {
  name: string;
  system: AnatomicalSystem;
  description: string;
  clinicalSignificance?: string;
}

const MESH_MAP: Record<number, StructureMapping> = {
  // Cartilage / intervertebral discs (#dadc98)
  0: { name: "Intervertebral Discs", system: "skeletal", description: "Fibrocartilaginous discs between lumbar vertebral bodies. Composed of nucleus pulposus and annulus fibrosus." },
  1: { name: "Pubic Symphysis Cartilage", system: "skeletal", description: "Fibrocartilaginous joint between the two pubic bones. Contains the interpubic disc.", clinicalSignificance: "Landmark for retropubic procedures (TVT, Burch colposuspension). Widens during pregnancy under relaxin influence." },
  2: { name: "Sacroiliac Joint Cartilage (L)", system: "skeletal", description: "Cartilaginous component of the left sacroiliac joint." },
  3: { name: "Sacroiliac Joint Cartilage (R)", system: "skeletal", description: "Cartilaginous component of the right sacroiliac joint." },

  // Major pelvic bones (#cccccc)
  4: { name: "Pelvic Bone (Os Coxae)", system: "skeletal", description: "The hip bone — fusion of ilium, ischium, and pubis. Forms the lateral and anterior walls of the pelvic cavity. The pelvic brim separates the greater (false) from the lesser (true) pelvis.", clinicalSignificance: "Pelvic diameters assessed for obstetric adequacy. Contains the obturator foramen and acetabulum." },
  5: { name: "Pubic Bones", system: "skeletal", description: "Anterior pelvic bones forming the pubic arch. Superior and inferior pubic rami connect to the ischium and ilium.", clinicalSignificance: "The subpubic angle is wider in females (~80-85°) for childbirth. Corona mortis crosses the superior pubic ramus." },
  6: { name: "Pelvic Inlet Ring", system: "skeletal", description: "The bony ring of the pelvic inlet, formed by the sacral promontory, arcuate lines, pectineal lines, and pubic crest.", clinicalSignificance: "Conjugate diameter ~11cm, transverse ~13cm. Assessed during obstetric examination." },
  7: { name: "Iliac Wings", system: "skeletal", description: "The broad, fan-shaped superior portions of the ilia. The iliac crest is palpable and contains the ASIS and PSIS landmarks.", clinicalSignificance: "ASIS is the reference for the inguinal ligament. Bone marrow biopsy performed at the posterior iliac crest." },
  17: { name: "Upper Sacrum (S1-S2)", system: "skeletal", description: "Superior segments of the sacrum. S1 forms the sacral promontory — the most prominent anterior point.", clinicalSignificance: "Sacral promontory is the key obstetric landmark defining the conjugate diameter. Sacrocolpopexy mesh is anchored at S1." },
  18: { name: "Sacral Promontory", system: "skeletal", description: "The anterior projection of S1 into the pelvic cavity. Defines the posterior border of the pelvic inlet." },

  // Vertebrae (#dcdcc0 - superior group)
  8: { name: "L5 Vertebra", system: "skeletal", description: "Fifth lumbar vertebra. The L5-S1 junction is where the lumbosacral trunk forms." },
  9: { name: "L4 Vertebra", system: "skeletal", description: "Fourth lumbar vertebra. The aortic bifurcation occurs at the L4 level.", clinicalSignificance: "Aortic bifurcation into common iliac arteries occurs here. Spinal anesthesia typically targets L3-L4 or L4-L5." },
  10: { name: "Sacrum", system: "skeletal", description: "Triangular bone formed by fusion of 5 sacral vertebrae. Sacral foramina transmit the sacral nerve roots.", clinicalSignificance: "Anterior surface is the presacral space — site of life-threatening venous hemorrhage. Sacral nerve roots S2-S4 carry parasympathetic fibers." },
  11: { name: "Coccyx", system: "skeletal", description: "Terminal bone of the vertebral column, typically 3-5 fused segments. Attachment for the anococcygeal ligament and pelvic floor.", clinicalSignificance: "Coccydynia (tailbone pain) common after childbirth. Attachment point for levator ani and the anococcygeal raphe." },
  12: { name: "L3 Vertebra", system: "skeletal", description: "Third lumbar vertebra. The conus medullaris (end of spinal cord) typically terminates at L1-L2." },
  13: { name: "L2 Vertebra", system: "skeletal", description: "Second lumbar vertebra." },

  // Arteries (#c00808 - dark red)
  14: { name: "Abdominal Aorta & Common Iliacs", system: "arterial", description: "The abdominal aorta bifurcates at L4 into right and left common iliac arteries. Each common iliac divides at the pelvic brim into external and internal iliac arteries.", clinicalSignificance: "The aortic bifurcation is at risk during presacral dissection. Common iliac artery aneurysms may compress the ureter." },
  15: { name: "Internal Iliac Artery Branches", system: "arterial", description: "The internal iliac artery is the main blood supply to the pelvis. Anterior division branches: uterine, superior vesical, vaginal, obturator, middle rectal, internal pudendal, inferior gluteal. Posterior division: superior gluteal, iliolumbar, lateral sacral.", clinicalSignificance: "Internal iliac artery ligation reduces pulse pressure 85% distally — a life-saving maneuver for pelvic hemorrhage. The uterine artery crosses over the ureter ('water under the bridge')." },
  16: { name: "External Iliac Arteries", system: "arterial", description: "Continue from the common iliac along the pelvic brim to become the femoral arteries at the inguinal ligament. Give inferior epigastric and deep circumflex iliac branches.", clinicalSignificance: "The external iliac nodes along these vessels are removed during pelvic lymphadenectomy." },

  // Lumbar spine (#dcdcc0 continued)
  19: { name: "L1 Vertebra", system: "skeletal", description: "First lumbar vertebra. Conus medullaris typically at this level." },
  20: { name: "T12 Vertebra", system: "skeletal", description: "Twelfth thoracic vertebra. Transition zone between thoracic and lumbar spine." },
  21: { name: "Sacral Ala (L)", system: "skeletal", description: "Left lateral mass of the sacrum, articulating with the ilium at the sacroiliac joint." },
  22: { name: "Sacral Ala (R)", system: "skeletal", description: "Right sacral ala." },
  23: { name: "L3-L4 Region", system: "skeletal", description: "Vertebral segment at L3-L4 level." },
  24: { name: "L4-L5 Region", system: "skeletal", description: "Lumbosacral junction region." },
  25: { name: "Transverse Processes", system: "skeletal", description: "Lateral projections of the lumbar vertebrae. Attachment points for paraspinal muscles." },

  // Nerves (#fffa2b - yellow)
  26: { name: "Lumbar Plexus (L1-L4)", system: "nervous", description: "Formed within the psoas major muscle from L1-L4 ventral rami. Gives rise to iliohypogastric, ilioinguinal, genitofemoral, lateral femoral cutaneous, femoral, and obturator nerves." },
  27: { name: "Lumbosacral Trunk (L4-L5)", system: "nervous", description: "Descends over the sacral ala to join the sacral plexus. Carries contributions from L4-L5 to the sciatic nerve.", clinicalSignificance: "At risk during pelvic sidewall surgery and lymphadenectomy. Compression causes foot drop." },
  28: { name: "Sacral Plexus (L4-S4)", system: "nervous", description: "Formed on the anterior surface of the piriformis muscle from the lumbosacral trunk plus S1-S4 ventral rami. Gives rise to the sciatic, pudendal, and superior/inferior gluteal nerves.", clinicalSignificance: "The sciatic nerve (largest in the body) exits below piriformis. The pudendal nerve wraps around the ischial spine." },
  29: { name: "Superior Hypogastric Plexus", system: "nervous", description: "The 'presacral nerve' — sympathetic plexus at the L5-S1 level between the common iliac arteries. Divides into right and left hypogastric nerves.", clinicalSignificance: "Presacral neurectomy for central dysmenorrhea. At risk during sacrocolpopexy and rectal mobilization." },
  30: { name: "Sciatic Nerve (L4-S3)", system: "nervous", description: "Largest nerve in the body. Exits the pelvis through the greater sciatic foramen below piriformis. Divides into tibial and common peroneal nerves in the posterior thigh.", clinicalSignificance: "At risk during sacrospinous ligament fixation, deep pelvic dissection, and hip arthroplasty. Injury causes leg weakness." },
  31: { name: "Pudendal Nerve (S2-S4)", system: "nervous", description: "Exits greater sciatic foramen below piriformis, hooks around the ischial spine, enters Alcock's canal. Branches: inferior rectal, perineal, dorsal nerve of clitoris.", clinicalSignificance: "Block at ischial spine for perineal anesthesia. At risk during SSLF. Damage causes fecal/urinary incontinence and loss of perineal sensation." },
  32: { name: "Obturator Nerve (L2-L4)", system: "nervous", description: "Descends along the lateral pelvic wall through the obturator foramen. Supplies adductor muscles and medial thigh sensation.", clinicalSignificance: "At risk during pelvic lymphadenectomy (runs through obturator fossa) and TOT sling. Obturator reflex during TURBT." },
  33: { name: "Pelvic Splanchnic Nerves (S2-S4)", system: "nervous", description: "Parasympathetic 'nervi erigentes' from S2-S4. Join the inferior hypogastric plexus to supply pelvic viscera.", clinicalSignificance: "ESSENTIAL for bladder function and sexual function. Injured during radical hysterectomy parametrial resection." },
  34: { name: "Sacral Root S1", system: "nervous", description: "First sacral nerve root. Major contributor to sciatic nerve and lumbosacral trunk." },
  35: { name: "Sacral Root S2", system: "nervous", description: "Second sacral nerve root. Contributes to sciatic nerve and carries parasympathetic fibers.", clinicalSignificance: "S2-S4 carry parasympathetic innervation to bladder, rectum, and genitalia." },
  36: { name: "Sacral Root S3", system: "nervous", description: "Third sacral nerve root. Major contributor to pudendal nerve and pelvic splanchnic nerves." },
  37: { name: "Sacral Root S4", system: "nervous", description: "Fourth sacral nerve root. Contributes to pudendal and pelvic splanchnic nerves." },
  38: { name: "Femoral Nerve (L2-L4)", system: "nervous", description: "Largest branch of lumbar plexus. Passes beneath the inguinal ligament lateral to the femoral artery. Supplies quadriceps and anterior thigh sensation." },
  39: { name: "Genitofemoral Nerve (L1-L2)", system: "nervous", description: "Descends on the anterior surface of psoas major. Genital branch enters the inguinal canal; femoral branch supplies skin over femoral triangle." },

  // Internal iliac branches (#ed3b3b)
  40: { name: "Uterine Arteries", system: "arterial", description: "KEY gynecologic vessels from the anterior division of the internal iliac artery. Cross the ureter SUPERIORLY 1-2cm lateral to the cervix ('water under the bridge').", clinicalSignificance: "Must be ligated while preserving ureter during hysterectomy. Uterine artery embolization treats fibroids. Ascending branch supplies the uterine body." },
  41: { name: "Vaginal & Vesical Arteries", system: "arterial", description: "Vaginal artery supplies vaginal walls and forms azygos arteries. Superior vesical artery (from patent umbilical artery) supplies the bladder dome." },
  42: { name: "Internal Pudendal Arteries", system: "arterial", description: "Exit the pelvis below piriformis, hook around the ischial spine, enter Alcock's canal. The main perineal blood supply.", clinicalSignificance: "Branches: inferior rectal, perineal, artery of the bulb, dorsal artery of clitoris. Main blood supply to the perineum." },

  // Pelvic wall bones (#dcdcc0 - inferior group)
  43: { name: "Ischium (L)", system: "skeletal", description: "Left ischium — forms the posteroinferior part of the pelvis. Contains the ischial spine and ischial tuberosity.", clinicalSignificance: "Ischial spine is THE critical landmark for pudendal nerve block and SSLF. Ischial tuberosity is weight-bearing in sitting." },
  44: { name: "Ischium (R)", system: "skeletal", description: "Right ischium." },
  45: { name: "Obturator Foramen Region", system: "skeletal", description: "Large opening in the os coxae, covered by the obturator membrane. The obturator canal at its superolateral margin transmits the obturator nerve and vessels." },
  46: { name: "Inferior Pubic Ramus (L)", system: "skeletal", description: "Left inferior pubic ramus — forms the pubic arch with the contralateral ramus." },
  47: { name: "Inferior Pubic Ramus (R)", system: "skeletal", description: "Right inferior pubic ramus." },
  48: { name: "Acetabular Region", system: "skeletal", description: "The cup-shaped socket of the hip joint, formed by contributions from the ilium, ischium, and pubis." },
  49: { name: "Superior Pubic Ramus (L)", system: "skeletal", description: "Connects the pubic body to the ilium. Forms the anterior portion of the pelvic brim." },
  50: { name: "Superior Pubic Ramus (R)", system: "skeletal", description: "Right superior pubic ramus." },

  // Pelvic viscera (#7b4b57 - dark rose)
  51: { name: "Rectum (Upper)", system: "organs", description: "Upper rectum (~12-15cm total). Follows the sacral curve. Surrounded by mesorectal fat containing lymph nodes and superior rectal vessels.", clinicalSignificance: "Total mesorectal excision (TME) plane is between mesorectal and parietal pelvic fascia. No serosa below the peritoneal reflection." },
  52: { name: "Rectum (Middle)", system: "organs", description: "Mid-rectum at the level of the peritoneal reflection. The anterior peritoneal reflection is higher in females due to the rectouterine pouch (Pouch of Douglas)." },
  53: { name: "Anal Canal", system: "organs", description: "~3-4cm. The dentate (pectinate) line divides upper (columnar, visceral innervation, portal drainage) from lower (squamous, somatic/pudendal innervation, systemic drainage).", clinicalSignificance: "Above dentate line: internal iliac node drainage. Below: superficial inguinal nodes. Critical for cancer staging and surgical planning." },
  54: { name: "Rectum (Lower)", system: "organs", description: "Lowest portion of the rectum, transitioning to the anal canal. Related anteriorly to the posterior vaginal wall via the rectovaginal septum." },
  55: { name: "Sigmoid Colon", system: "organs", description: "S-shaped segment of colon transitioning to rectum at the sacral promontory. Mobile on its mesentery." },

  // Bone posterior (#dcdcc0)
  56: { name: "Iliac Fossa (L)", system: "skeletal", description: "Concave medial surface of the iliac wing. Contains the iliacus muscle." },
  57: { name: "Greater Sciatic Notch", system: "skeletal", description: "Large notch on the posterior ilium. The piriformis muscle divides it into suprapiriform and infrapiriform spaces.", clinicalSignificance: "The sciatic nerve exits through the infrapiriform space. Superior gluteal vessels pass through the suprapiriform space." },
  58: { name: "Lesser Sciatic Notch", system: "skeletal", description: "Smaller notch below the ischial spine, between ischial spine and ischial tuberosity. Bounded by sacrospinous and sacrotuberous ligaments." },
  59: { name: "Iliac Fossa (R)", system: "skeletal", description: "Right iliac fossa." },

  // Muscles / pelvic floor (#eb6666 - pink)
  60: { name: "Levator Ani", system: "muscular", description: "The primary muscle of the pelvic floor — a funnel-shaped diaphragm composed of pubococcygeus, puborectalis, and iliococcygeus. The urogenital hiatus transmits the urethra, vagina, and rectum.", clinicalSignificance: "The levator hiatus is the primary site of weakness in pelvic organ prolapse. Avulsion occurs in ~36% of vaginal deliveries." },
  61: { name: "Coccygeus / Ischiococcygeus", system: "muscular", description: "Triangular muscle from ischial spine to lateral sacrum/coccyx. Often partially tendinous, blending with the sacrospinous ligament. Completes the pelvic diaphragm posteriorly." },
  62: { name: "Obturator Internus", system: "muscular", description: "Pelvic wall muscle covering the obturator foramen. Its fascia gives rise to the ATFP (arcus tendineus fasciae pelvis) and forms Alcock's canal.", clinicalSignificance: "The ATFP ('white line') is the lateral attachment of pubocervical fascia — detachment causes paravaginal defect (lateral cystocele). Alcock's canal contains the pudendal neurovascular bundle." },
  63: { name: "Piriformis", system: "muscular", description: "Origin: anterior sacrum (S2-S4). Exits through the greater sciatic foramen, dividing it into suprapiriform and infrapiriform compartments.", clinicalSignificance: "The sciatic nerve exits below piriformis (~88%). Superior gluteal nerve/vessels pass above it. Piriformis syndrome mimics sciatica." },
  64: { name: "Pelvic Floor Fascia", system: "muscular", description: "The fascial layers overlying the pelvic floor musculature. Includes the superior and inferior fasciae of the pelvic diaphragm." },

  // Reproductive organs (#efa4a4 - light pink)
  65: { name: "Uterus", system: "organs", description: "Pear-shaped muscular organ. Parts: fundus, body, isthmus, cervix. Three-layered wall: endometrium, myometrium, perimetrium. Typically anteverted and anteflexed.", clinicalSignificance: "Primary support: cardinal ligaments (Level I), uterosacral ligaments. Uterine artery is primary blood supply; ovarian artery provides collateral at fundus." },
  66: { name: "Urinary Bladder", system: "organs", description: "Muscular reservoir. Trigone between two ureteric orifices and internal urethral orifice. Detrusor muscle has 3 layers.", clinicalSignificance: "Parasympathetic (S2-S4) contracts detrusor; sympathetic relaxes it. At risk during cesarean section (bladder flap), anterior colporrhaphy, and radical hysterectomy." },
  67: { name: "Vagina & Cervix", system: "organs", description: "Vagina: fibromuscular canal ~7-10cm with anterior, posterior (deepest), and lateral fornices. Cervix: lower uterus with ectocervix and endocervical canal. The transformation zone is where neoplasia develops.", clinicalSignificance: "DeLancey levels: I (apex — cardinal/uterosacral), II (mid — paravaginal), III (distal — perineal body). Posterior fornix is thinnest point to peritoneal cavity." },
};

// ─── GLTF Mesh Component ───────────────────────────────────

function GLTFMesh({
  mesh,
  structureName,
  system,
  description,
  clinicalSignificance,
  originalColor,
}: {
  mesh: THREE.Mesh;
  structureName: string;
  system: AnatomicalSystem;
  description?: string;
  clinicalSignificance?: string;
  originalColor: THREE.Color;
}) {
  // Single batched selector — 1 subscription instead of 10
  const store = useAppStore(
    useShallow((s) => ({
      isHovered: s.hoveredStructure === structureName,
      isSelected: s.selectedStructure?.name === structureName,
      xRayMode: s.xRayMode,
      systemVisible: s.visibleSystems[system],
      systemOpacity: s.systemOpacity[system],
      isWarning: s.warningStructures.includes(structureName),
      highlightColor: s.highlightColors[structureName] as string | undefined,
      quizMode: s.quizMode,
      quizTarget: s.quizTarget,
    }))
  );
  const setHover = useAppStore((s) => s.setHoveredStructure);
  const setSelected = useAppStore((s) => s.setSelectedStructure);
  const clippingPlanes = useContext(ClippingPlanesContext);

  const meshRef = useRef<THREE.Mesh>(null!);
  const currentOpacity = useRef(store.systemVisible ? store.systemOpacity : 0);
  const prevTransparent = useRef(true);

  useEffect(() => {
    if (meshRef.current) meshRegistry.set(structureName, meshRef.current);
    return () => { meshRegistry.delete(structureName); };
  }, [structureName]);

  // Set clipping planes only when they change
  useEffect(() => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
      mat.clippingPlanes = clippingPlanes.length > 0 ? clippingPlanes : null;
      mat.needsUpdate = true;
    }
  }, [clippingPlanes]);

  let targetOpacity: number;
  if (store.xRayMode) {
    targetOpacity = store.isSelected ? 1.0 : store.isHovered ? 0.5 : 0.12;
  } else {
    targetOpacity = store.systemVisible ? store.systemOpacity : 0;
  }

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
    const diff = targetOpacity - currentOpacity.current;
    if (Math.abs(diff) > 0.003) {
      currentOpacity.current += diff * Math.min(6 * delta, 1);
    } else {
      currentOpacity.current = targetOpacity;
    }
    const op = currentOpacity.current;
    mat.opacity = op;
    mat.depthWrite = op >= 0.9;

    // Only trigger needsUpdate when transparent state changes
    const newTransparent = op < 0.9;
    if (newTransparent !== prevTransparent.current) {
      mat.transparent = true; // always transparent for animation
      mat.needsUpdate = true;
      prevTransparent.current = newTransparent;
    }

    // Emissive — uses pre-allocated colors
    if (store.isWarning) {
      mat.emissive.copy(WARNING_COLOR);
      mat.emissiveIntensity = Math.sin(clock.elapsedTime * 3) * 0.2 + 0.35;
    } else if (store.highlightColor) {
      mat.emissive.set(store.highlightColor);
      mat.emissiveIntensity = 0.3;
    } else if (store.isHovered) {
      mat.emissive.copy(originalColor);
      mat.emissiveIntensity = 0.3;
    } else if (store.isSelected) {
      mat.emissive.copy(originalColor);
      mat.emissiveIntensity = 0.15;
    } else {
      mat.emissive.copy(BLACK);
      mat.emissiveIntensity = 0;
    }

    meshRef.current.visible = op > 0.003;
  });

  return (
    <>
      <mesh
        ref={meshRef}
        geometry={mesh.geometry}
        onPointerOver={(e) => { e.stopPropagation(); setHover(structureName); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHover(null); document.body.style.cursor = "default"; }}
        onClick={(e) => {
          e.stopPropagation();
          setSelected({ id: structureName, name: structureName, system, description, clinicalSignificance });
        }}
      >
        <meshPhysicalMaterial
          color={originalColor}
          roughness={system === "skeletal" ? 0.7 : system === "organs" ? 0.35 : system === "arterial" ? 0.25 : system === "nervous" ? 0.4 : 0.45}
          metalness={system === "arterial" ? 0.08 : 0.02}
          clearcoat={system === "skeletal" ? 0.15 : system === "organs" ? 0.35 : 0.05}
          clearcoatRoughness={0.4}
          transparent
          opacity={1}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Html
          position={mesh.geometry.boundingSphere?.center ?? [0, 0, 0]}
          center distanceFactor={8}
          style={{
            pointerEvents: "none",
            visibility: store.isHovered && !(store.quizMode === "identify" && store.quizTarget === structureName) ? "visible" : "hidden",
          }}
        >
          <div style={{
            background: "rgba(10,10,18,0.92)", border: "1px solid rgba(30,30,50,0.8)",
            borderRadius: "6px", padding: "4px 10px", fontSize: "11px",
            color: "#e4e4ef", whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          }}>
            {structureName}
          </div>
        </Html>
    </>
  );
}

// ─── Main GLTF Model ─────────────────────────────────────────

export function GLTFPelvicModel() {
  const { scene } = useGLTF("/models/pelvis-supply-organs-mri.glb");

  const structures = useMemo(() => {
    const result: {
      mesh: THREE.Mesh;
      name: string;
      system: AnatomicalSystem;
      description?: string;
      clinicalSignificance?: string;
      color: THREE.Color;
    }[] = [];

    let meshIndex = 0;
    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat?.color) return;

      mesh.geometry.computeBoundingBox();
      mesh.geometry.computeBoundingSphere();

      const mapping = MESH_MAP[meshIndex];
      if (mapping) {
        result.push({
          mesh,
          name: mapping.name,
          system: mapping.system,
          description: mapping.description,
          clinicalSignificance: mapping.clinicalSignificance,
          color: mat.color.clone(),
        });
      }

      meshIndex++;
    });

    return result;
  }, [scene]);

  // Model is ~290 units wide, centered at (-5.6, 1.6, 21.7). Scale to ~2.5 units.
  const scale = 0.008;

  return (
    <group scale={scale} position={[5.6 * scale, -1.6 * scale, -21.7 * scale]}>
      {structures.map(({ mesh, name, system, description, clinicalSignificance, color }) => (
        <GLTFMesh
          key={name}
          mesh={mesh}
          structureName={name}
          system={system}
          description={description}
          clinicalSignificance={clinicalSignificance}
          originalColor={color}
        />
      ))}
    </group>
  );
}

useGLTF.preload("/models/pelvis-supply-organs-mri.glb");
