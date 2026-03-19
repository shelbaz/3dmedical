import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useAppStore } from "../../store/useAppStore";
import type { AnatomicalSystem } from "../../types/anatomy";

// ─── Mesh Registry (for Outline effect) ─────────────────────

export const meshRegistry = new Map<string, THREE.Mesh>();

// ─── Clipping Context ───────────────────────────────────────

export const ClippingPlanesContext = createContext<THREE.Plane[]>([]);

// ─── System Opacity Context ─────────────────────────────────

interface SystemCtx {
  targetVisible: boolean;
  systemOpacity: number;
}
const SystemOpacityContext = createContext<SystemCtx>({
  targetVisible: true,
  systemOpacity: 1,
});

// ─── Geometry Helpers ────────────────────────────────────────

export function makeTube(
  points: [number, number, number][],
  radius = 0.02,
  tubularSegments?: number
): THREE.TubeGeometry {
  const curve = new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(p[0], p[1], p[2]))
  );
  return new THREE.TubeGeometry(
    curve,
    tubularSegments ?? Math.max(points.length * 12, 24),
    radius,
    8,
    false
  );
}

export function makeLathe(
  profile: [number, number][],
  segments = 32
): THREE.LatheGeometry {
  return new THREE.LatheGeometry(
    profile.map((p) => new THREE.Vector2(p[0], p[1])),
    segments
  );
}

export function makeExtruded(
  shapeFn: (s: THREE.Shape) => void,
  depth: number,
  bevel = false
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shapeFn(shape);
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel,
    bevelThickness: bevel ? 0.015 : 0,
    bevelSize: bevel ? 0.015 : 0,
    bevelSegments: bevel ? 3 : 0,
  });
}

export function makeEllipseRing(
  radiusX: number,
  radiusZ: number,
  tubeRadius = 0.04,
  segments = 64
): THREE.TubeGeometry {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(radiusX * Math.cos(t), 0, radiusZ * Math.sin(t)));
  }
  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(pts, true),
    segments,
    tubeRadius,
    8,
    true
  );
}

// ─── Structure Component ─────────────────────────────────────

interface StructureProps {
  name: string;
  system: AnatomicalSystem;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  geometry?: THREE.BufferGeometry;
  color: string;
  opacity?: number;
  roughness?: number;
  metalness?: number;
  description?: string;
  clinicalSignificance?: string;
  children?: React.ReactNode;
}

export function Structure({
  name,
  system,
  position,
  rotation,
  scale,
  geometry,
  color,
  opacity,
  roughness,
  metalness,
  description,
  clinicalSignificance,
  children,
}: StructureProps) {
  const isHovered = useAppStore((s) => s.hoveredStructure === name);
  const isSelected = useAppStore((s) => s.selectedStructure?.name === name);
  const setHover = useAppStore((s) => s.setHoveredStructure);
  const setSelected = useAppStore((s) => s.setSelectedStructure);
  const xRayMode = useAppStore((s) => s.xRayMode);
  const clippingPlanes = useContext(ClippingPlanesContext);
  const isWarning = useAppStore((s) => s.warningStructures.includes(name));
  const highlightColor = useAppStore((s) => s.highlightColors[name]);
  const quizMode = useAppStore((s) => s.quizMode);
  const quizTarget = useAppStore((s) => s.quizTarget);

  const { targetVisible, systemOpacity } = useContext(SystemOpacityContext);
  const meshRef = useRef<THREE.Mesh>(null!);
  const currentOpacity = useRef(targetVisible ? (opacity ?? 1) * systemOpacity : 0);

  // Register mesh for outline effect
  useEffect(() => {
    if (meshRef.current) meshRegistry.set(name, meshRef.current);
    return () => { meshRegistry.delete(name); };
  }, [name]);

  const localOpacity = opacity ?? 1;

  // Compute target opacity
  let targetOpacity: number;
  let targetDepthWrite: boolean;
  if (xRayMode) {
    targetOpacity = isSelected ? 1.0 : isHovered ? 0.5 : 0.12;
    targetDepthWrite = isSelected;
  } else {
    targetOpacity = targetVisible ? systemOpacity * localOpacity : 0;
    targetDepthWrite = targetOpacity >= 0.99;
  }

  // Smooth opacity animation + warning pulse via useFrame
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
    mat.transparent = op < 0.99;
    mat.depthWrite = xRayMode ? targetDepthWrite : op >= 0.99;
    mat.side = op < 0.99 ? THREE.DoubleSide : THREE.FrontSide;

    // Warning pulse (red glow for at-risk structures)
    if (isWarning) {
      const pulse = Math.sin(clock.elapsedTime * 3) * 0.2 + 0.35;
      mat.emissive = new THREE.Color("#ef4444");
      mat.emissiveIntensity = pulse;
    }

    mat.needsUpdate = true;
    meshRef.current.visible = op > 0.003;
  });

  // Material color — warning overrides, then highlight color, then normal
  const materialColor = isWarning
    ? "#ef4444"
    : highlightColor
    ? highlightColor
    : isHovered && !xRayMode
    ? "#ffffff"
    : color;
  const emissive = isWarning
    ? "#ef4444"
    : highlightColor ?? (isHovered ? color : "#000000");
  const emissiveIntensity = isWarning
    ? 0.35
    : highlightColor
    ? 0.3
    : isHovered
    ? 0.35
    : isSelected
    ? 0.15
    : 0;

  // Common material props
  const baseMaterialProps = {
    color: materialColor,
    emissive,
    emissiveIntensity,
    transparent: true,
    opacity: currentOpacity.current,
    roughness: roughness ?? 0.5,
    metalness: metalness ?? 0.05,
    side: currentOpacity.current < 0.99 ? THREE.DoubleSide : THREE.FrontSide,
    depthWrite: currentOpacity.current >= 0.99,
    clippingPlanes: clippingPlanes.length > 0 ? clippingPlanes : undefined,
  };

  // Choose material based on system
  const renderMaterial = () => {
    if (system === "organs") {
      return (
        <meshPhysicalMaterial
          {...baseMaterialProps}
          roughness={roughness ?? 0.45}
          transmission={xRayMode ? 0 : 0.15}
          thickness={0.5}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
        />
      );
    }
    if (system === "skeletal") {
      return (
        <meshPhysicalMaterial
          {...baseMaterialProps}
          roughness={roughness ?? 0.8}
          clearcoat={0.1}
          clearcoatRoughness={0.5}
        />
      );
    }
    if (system === "arterial" || system === "venous") {
      return (
        <meshStandardMaterial
          {...baseMaterialProps}
          roughness={roughness ?? 0.3}
          metalness={metalness ?? 0.1}
        />
      );
    }
    return <meshStandardMaterial {...baseMaterialProps} />;
  };

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(name);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(null);
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.stopPropagation();
          // In quiz locate mode, clicking always goes through setSelected
          // The QuizPanel listens for selectedStructure changes
          setSelected({ id: name, name, system, description, clinicalSignificance });
        }}
      >
        {children}
        {renderMaterial()}
      </mesh>
      {isHovered && !(quizMode === "identify" && quizTarget === name) && (
        <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(18,18,26,0.92)",
              border: "1px solid rgba(42,42,62,0.8)",
              borderRadius: "4px",
              padding: "4px 10px",
              fontSize: "11px",
              color: "#e0e0e8",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            {name}
          </div>
        </Html>
      )}
    </group>
  );
}

// ─── System Group Wrapper ────────────────────────────────────

export function SystemGroup({
  system,
  children,
}: {
  system: AnatomicalSystem;
  children: React.ReactNode;
}) {
  const visible = useAppStore((s) => s.visibleSystems[system]);
  const opacity = useAppStore((s) => s.systemOpacity[system]);
  const [groupVisible, setGroupVisible] = useState(visible);
  const fadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
      setGroupVisible(true);
    } else {
      fadeTimeout.current = setTimeout(() => setGroupVisible(false), 450);
    }
    return () => {
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    };
  }, [visible]);

  const ctx = useMemo(
    () => ({ targetVisible: visible, systemOpacity: opacity }),
    [visible, opacity]
  );

  return (
    <SystemOpacityContext.Provider value={ctx}>
      <group visible={groupVisible}>{children}</group>
    </SystemOpacityContext.Provider>
  );
}
