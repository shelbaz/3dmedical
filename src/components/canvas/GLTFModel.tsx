import { useEffect, useMemo, useRef, useContext } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useAppStore } from "../../store/useAppStore";
import { meshRegistry, ClippingPlanesContext } from "./utils";
import type { AnatomicalSystem } from "../../types/anatomy";

/** Maps material names from the GLTF to our structure registry */
const MATERIAL_TO_STRUCTURE: Record<
  string,
  { name: string; system: AnatomicalSystem; description?: string; clinicalSignificance?: string }
> = {
  Uterus_Whole: {
    name: "Uterus",
    system: "organs",
    description: "Pear-shaped muscular organ. Parts: fundus, body, isthmus, cervix. Three-layered wall: endometrium, myometrium, perimetrium.",
    clinicalSignificance: "Primary support: cardinal ligaments (Level I), uterosacral ligaments. Uterine artery is primary blood supply.",
  },
  Bladder: {
    name: "Urinary Bladder",
    system: "organs",
    description: "Muscular reservoir. Trigone between two ureteric orifices and internal urethral orifice.",
    clinicalSignificance: "Parasympathetic (S2-S4) contracts detrusor. Radical hysterectomy can denervate the bladder.",
  },
  Bone__Female_Pelvis: {
    name: "Pelvic Bones",
    system: "skeletal",
    description: "Os coxae — fused ilium, ischium, and pubis. The pelvic brim divides the greater and lesser pelvis.",
  },
  Bone__Female_Sacrum: {
    name: "Sacrum",
    system: "skeletal",
    description: "Triangular bone formed by fusion of S1-S5. The sacral promontory is a key obstetric landmark.",
    clinicalSignificance: "Fixation point for sacrocolpopexy. Sacral nerve roots S2-S4 provide parasympathetic innervation to pelvic viscera.",
  },
  Bone__Female_Coccyx: {
    name: "Coccyx",
    system: "skeletal",
    description: "Terminal bone of the vertebral column, typically 3-5 fused segments.",
  },
  BONE_NEW_larger_2: {
    name: "Lumbar Vertebrae",
    system: "skeletal",
    description: "L4-L5 vertebrae. The aortic bifurcation occurs at L4. The common iliac arteries originate here.",
  },
  Fallopian_Tube_Whole: {
    name: "Fallopian Tubes",
    system: "organs",
    description: "Parts: intramural, isthmus, ampulla (fertilization site), infundibulum with fimbriae. Supported by mesosalpinx.",
  },
  Ovary2: {
    name: "Ovaries",
    system: "organs",
    description: "In the ovarian fossa. Lymphatics drain DIRECTLY to para-aortic nodes via ovarian vessels.",
    clinicalSignificance: "Direct para-aortic drainage means ovarian cancer staging requires para-aortic lymphadenectomy.",
  },
  Ovarian_Ligament: {
    name: "Ovarian Ligament",
    system: "fascia",
    description: "Connects ovary to uterus. Runs within the broad ligament from the medial ovarian pole to the uterine cornu.",
  },
  Cartilage: {
    name: "Pubic Symphysis",
    system: "skeletal",
    description: "Secondary cartilaginous joint between the two pubic bones. Contains a fibrocartilaginous interpubic disc.",
    clinicalSignificance: "Landmark for retropubic procedures (TVT, Burch colposuspension).",
  },
  ureter: {
    name: "Ureters",
    system: "organs",
    description: "Enters pelvis at common iliac bifurcation. Five pelvic segments.",
    clinicalSignificance: "THREE classic injury sites: (1) pelvic brim under IP ligament, (2) cardinal ligament, (3) intramural segment at bladder entry.",
  },
  kidney_new: {
    name: "Kidneys",
    system: "organs",
    description: "Retroperitoneal organs at T12-L3 level. Renal hilum contains renal artery, vein, ureter, and lymphatics.",
  },
  adrenal_gland_NEW_2: {
    name: "Adrenal Glands",
    system: "organs",
    description: "Suprarenal glands atop each kidney. Cortex produces steroid hormones; medulla produces catecholamines.",
  },
  Transparent_Skin: {
    name: "Body Contour",
    system: "organs",
    description: "Transparent body surface for anatomical reference.",
  },
};

function GLTFMesh({
  mesh,
  materialName,
  structureInfo,
}: {
  mesh: THREE.Mesh;
  materialName: string;
  structureInfo: { name: string; system: AnatomicalSystem; description?: string; clinicalSignificance?: string };
}) {
  const { name, system, description, clinicalSignificance } = structureInfo;
  const isHovered = useAppStore((s) => s.hoveredStructure === name);
  const isSelected = useAppStore((s) => s.selectedStructure?.name === name);
  const setHover = useAppStore((s) => s.setHoveredStructure);
  const setSelected = useAppStore((s) => s.setSelectedStructure);
  const xRayMode = useAppStore((s) => s.xRayMode);
  const systemVisible = useAppStore((s) => s.visibleSystems[system]);
  const systemOpacity = useAppStore((s) => s.systemOpacity[system]);
  const isWarning = useAppStore((s) => s.warningStructures.includes(name));
  const highlightColor = useAppStore((s) => s.highlightColors[name]);
  const quizMode = useAppStore((s) => s.quizMode);
  const quizTarget = useAppStore((s) => s.quizTarget);
  const clippingPlanes = useContext(ClippingPlanesContext);

  const meshRef = useRef<THREE.Mesh>(null!);
  const currentOpacity = useRef(systemVisible ? systemOpacity : 0);

  // Register for outline effect
  useEffect(() => {
    if (meshRef.current) meshRegistry.set(name, meshRef.current);
    return () => { meshRegistry.delete(name); };
  }, [name]);

  // Opacity/visibility animation
  const isSkin = materialName === "Transparent_Skin";
  const baseOpacity = isSkin ? 0.05 : 1;

  let targetOpacity: number;
  if (xRayMode) {
    targetOpacity = isSelected ? 1.0 : isHovered ? 0.5 : 0.12;
  } else {
    targetOpacity = systemVisible ? systemOpacity * baseOpacity : 0;
  }

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const diff = targetOpacity - currentOpacity.current;
    if (Math.abs(diff) > 0.003) {
      currentOpacity.current += diff * Math.min(6 * delta, 1);
    } else {
      currentOpacity.current = targetOpacity;
    }
    const op = currentOpacity.current;
    mat.opacity = op;
    mat.transparent = true;
    mat.depthWrite = op >= 0.9;
    mat.side = THREE.DoubleSide;

    if (isWarning) {
      const pulse = Math.sin(clock.elapsedTime * 3) * 0.2 + 0.35;
      mat.emissive = new THREE.Color("#ef4444");
      mat.emissiveIntensity = pulse;
    } else if (highlightColor) {
      mat.emissive = new THREE.Color(highlightColor);
      mat.emissiveIntensity = 0.3;
    } else if (isHovered) {
      mat.emissiveIntensity = 0.25;
    } else if (isSelected) {
      mat.emissiveIntensity = 0.12;
    } else {
      mat.emissiveIntensity = 0;
    }

    if (clippingPlanes.length > 0) {
      mat.clippingPlanes = clippingPlanes;
    }

    mat.needsUpdate = true;
    meshRef.current.visible = op > 0.003;
  });

  return (
    <>
      <mesh
        ref={meshRef}
        geometry={mesh.geometry}
        onPointerOver={(e) => { e.stopPropagation(); setHover(name); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHover(null); document.body.style.cursor = "default"; }}
        onClick={(e) => {
          e.stopPropagation();
          setSelected({ id: name, name, system, description, clinicalSignificance });
        }}
      >
        <meshPhysicalMaterial
          color={(mesh.material as THREE.MeshStandardMaterial).color ?? "#cccccc"}
          map={(mesh.material as THREE.MeshStandardMaterial).map ?? null}
          roughness={system === "skeletal" ? 0.8 : 0.5}
          clearcoat={system === "skeletal" ? 0.1 : system === "organs" ? 0.3 : 0}
          transparent
          opacity={baseOpacity}
          side={THREE.DoubleSide}
        />
      </mesh>
      {isHovered && !(quizMode === "identify" && quizTarget === name) && (
        <Html
          position={mesh.geometry.boundingSphere?.center ?? [0, 0, 0]}
          center
          distanceFactor={8}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: "rgba(10,10,18,0.92)",
              border: "1px solid rgba(30,30,50,0.8)",
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "11px",
              color: "#e4e4ef",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
            }}
          >
            {name}
          </div>
        </Html>
      )}
    </>
  );
}

export function GLTFPelvicModel() {
  const { scene } = useGLTF("/models/female-reproductive-urinary.glb");

  const structures = useMemo(() => {
    const result: { mesh: THREE.Mesh; materialName: string; info: (typeof MATERIAL_TO_STRUCTURE)[string] }[] = [];

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const matName = mat?.name ?? "";
        const info = MATERIAL_TO_STRUCTURE[matName];
        if (info) {
          // Compute bounding sphere for tooltip positioning
          mesh.geometry.computeBoundingSphere();
          result.push({ mesh, materialName: matName, info });
        }
      }
    });

    return result;
  }, [scene]);

  return (
    <group>
      {structures.map(({ mesh, materialName, info }) => (
        <GLTFMesh
          key={info.name + materialName}
          mesh={mesh}
          materialName={materialName}
          structureInfo={info}
        />
      ))}
    </group>
  );
}

// Preload the model
useGLTF.preload("/models/female-reproductive-urinary.glb");
