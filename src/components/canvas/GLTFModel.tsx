import { useEffect, useMemo, useRef, useContext } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useAppStore } from "../../store/useAppStore";
import { meshRegistry, ClippingPlanesContext } from "./utils";
import type { AnatomicalSystem } from "../../types/anatomy";

/**
 * Color-based system classification for the MRI-derived model.
 * Maps material colors to anatomical systems + structure names.
 */
interface MeshMapping {
  system: AnatomicalSystem;
  namePrefix: string;
  description?: string;
  clinicalSignificance?: string;
}

function colorToHex(c: THREE.Color): string {
  return "#" + c.getHexString();
}

function classifyByColor(color: THREE.Color): MeshMapping {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);

  // Dark red (#c00808) = major arteries
  if (r > 150 && g < 30 && b < 30)
    return { system: "arterial", namePrefix: "Artery", description: "Arterial vessel derived from MRI segmentation.", clinicalSignificance: "Part of the pelvic arterial supply from the internal iliac artery system." };

  // Red (#ed3b3b) = arteries/smaller vessels
  if (r > 200 && g < 80 && b < 80)
    return { system: "arterial", namePrefix: "Arterial Branch", description: "Arterial branch from MRI segmentation." };

  // Yellow (#fffa2b) = nerves
  if (r > 200 && g > 200 && b < 80)
    return { system: "nervous", namePrefix: "Nerve", description: "Neural structure from MRI segmentation.", clinicalSignificance: "Pelvic nerves are critical for bladder, bowel, and sexual function. Damage during surgery causes significant morbidity." };

  // Dark rose (#7b4b57) = pelvic viscera (rectum, etc.)
  if (r > 100 && r < 140 && g > 60 && g < 90 && b > 70 && b < 100)
    return { system: "organs", namePrefix: "Pelvic Organ", description: "Pelvic organ from MRI segmentation." };

  // Pink (#eb6666) = reproductive organs
  if (r > 200 && g > 80 && g < 120 && b > 80 && b < 120)
    return { system: "organs", namePrefix: "Organ", description: "Reproductive/urinary organ from MRI segmentation." };

  // Light pink (#efa4a4) = uterus/bladder
  if (r > 200 && g > 140 && g < 180 && b > 140 && b < 180)
    return { system: "organs", namePrefix: "Organ", description: "Pelvic organ from MRI segmentation." };

  // Yellow-bone (#dadc98) = ligaments/cartilage
  if (r > 200 && g > 200 && b > 120 && b < 170)
    return { system: "fascia", namePrefix: "Ligament", description: "Ligamentous/cartilaginous structure from MRI segmentation." };

  // Bone (#dcdcc0) = skeletal
  if (r > 200 && g > 200 && b > 170)
    return { system: "skeletal", namePrefix: "Bone", description: "Bony structure from MRI segmentation of the female pelvis." };

  // Gray (#cccccc) = skeletal/cartilage
  if (r > 180 && g > 180 && b > 180 && Math.abs(r - g) < 10)
    return { system: "skeletal", namePrefix: "Bone", description: "Skeletal structure from MRI." };

  // Default
  return { system: "organs", namePrefix: "Structure", description: "Anatomical structure from MRI segmentation." };
}

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
  const isHovered = useAppStore((s) => s.hoveredStructure === structureName);
  const isSelected = useAppStore((s) => s.selectedStructure?.name === structureName);
  const setHover = useAppStore((s) => s.setHoveredStructure);
  const setSelected = useAppStore((s) => s.setSelectedStructure);
  const xRayMode = useAppStore((s) => s.xRayMode);
  const systemVisible = useAppStore((s) => s.visibleSystems[system]);
  const systemOpacity = useAppStore((s) => s.systemOpacity[system]);
  const isWarning = useAppStore((s) => s.warningStructures.includes(structureName));
  const highlightColor = useAppStore((s) => s.highlightColors[structureName]);
  const quizMode = useAppStore((s) => s.quizMode);
  const quizTarget = useAppStore((s) => s.quizTarget);
  const clippingPlanes = useContext(ClippingPlanesContext);

  const meshRef = useRef<THREE.Mesh>(null!);
  const currentOpacity = useRef(systemVisible ? systemOpacity : 0);

  useEffect(() => {
    if (meshRef.current) meshRegistry.set(structureName, meshRef.current);
    return () => { meshRegistry.delete(structureName); };
  }, [structureName]);

  let targetOpacity: number;
  if (xRayMode) {
    targetOpacity = isSelected ? 1.0 : isHovered ? 0.5 : 0.12;
  } else {
    targetOpacity = systemVisible ? systemOpacity : 0;
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
      mat.emissive.set("#ef4444");
      mat.emissiveIntensity = Math.sin(clock.elapsedTime * 3) * 0.2 + 0.35;
    } else if (highlightColor) {
      mat.emissive.set(highlightColor);
      mat.emissiveIntensity = 0.3;
    } else if (isHovered) {
      mat.emissive.set(originalColor);
      mat.emissiveIntensity = 0.3;
    } else if (isSelected) {
      mat.emissive.set(originalColor);
      mat.emissiveIntensity = 0.15;
    } else {
      mat.emissiveIntensity = 0;
    }

    if (clippingPlanes.length > 0) mat.clippingPlanes = clippingPlanes;
    mat.needsUpdate = true;
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
          roughness={system === "skeletal" ? 0.75 : system === "organs" ? 0.4 : 0.35}
          metalness={system === "arterial" || system === "venous" ? 0.1 : 0.02}
          clearcoat={system === "skeletal" ? 0.15 : system === "organs" ? 0.3 : 0}
          transparent
          opacity={1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {isHovered && !(quizMode === "identify" && quizTarget === structureName) && (
        <Html
          position={mesh.geometry.boundingSphere?.center ?? [0, 0, 0]}
          center
          distanceFactor={8}
          style={{ pointerEvents: "none" }}
        >
          <div style={{
            background: "rgba(10,10,18,0.92)",
            border: "1px solid rgba(30,30,50,0.8)",
            borderRadius: "6px",
            padding: "4px 10px",
            fontSize: "11px",
            color: "#e4e4ef",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          }}>
            {structureName}
          </div>
        </Html>
      )}
    </>
  );
}

// ─── Main GLTF Model Component ──────────────────────────────

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

    const counters: Record<string, number> = {};

    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat?.color) return;

      mesh.geometry.computeBoundingBox();
      mesh.geometry.computeBoundingSphere();

      const mapping = classifyByColor(mat.color);
      const prefix = mapping.namePrefix;

      // Generate unique name
      counters[prefix] = (counters[prefix] ?? 0) + 1;
      const name = counters[prefix] === 1 ? prefix : `${prefix} (${counters[prefix]})`;

      result.push({
        mesh,
        name,
        system: mapping.system,
        description: mapping.description,
        clinicalSignificance: mapping.clinicalSignificance,
        color: mat.color.clone(),
      });
    });

    return result;
  }, [scene]);

  // Model is in mm, Y-up. Scale to match our ~3 unit scene.
  // Center is ~(-5.6, 1.6, 21.7), size ~(290, 337, 180)
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
