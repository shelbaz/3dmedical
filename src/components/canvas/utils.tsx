import { createContext, useContext, useEffect, useMemo, useRef, useState, memo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
// Html tooltip removed — using fixed HoverLabel component instead
import { useAppStore } from "../../store/useAppStore";
import { useShallow } from "zustand/shallow";
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

// ─── Pre-allocated colors (avoid GC pressure in useFrame) ───

const WARNING_COLOR = new THREE.Color("#ef4444");
const BLACK = new THREE.Color("#000000");
const _tmpColor = new THREE.Color();

const HOVER_COLOR = new THREE.Color("#2563eb");

const SELECT_COLORS: Record<AnatomicalSystem, THREE.Color> = {
  skeletal: new THREE.Color("#fbbf24"),
  muscular: new THREE.Color("#f43f5e"),
  arterial: new THREE.Color("#ef4444"),
  venous: new THREE.Color("#3b82f6"),
  nervous: new THREE.Color("#facc15"),
  lymphatic: new THREE.Color("#22c55e"),
  organs: new THREE.Color("#ec4899"),
  fascia: new THREE.Color("#a78bfa"),
  spaces: new THREE.Color("#06b6d4"),
};

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

export const Structure = memo(function Structure({
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
  // Single batched selector — 1 subscription instead of 8
  const store = useAppStore(
    useShallow((s) => ({
      isHovered: s.hoveredStructure === name,
      isSelected: s.selectedStructure?.name === name,
      xRayMode: s.xRayMode,
      isWarning: s.warningStructures.includes(name),
      highlightColor: s.highlightColors[name] as string | undefined,
      quizMode: s.quizMode,
      quizTarget: s.quizTarget,
    }))
  );
  const setHover = useAppStore((s) => s.setHoveredStructure);
  const setSelected = useAppStore((s) => s.setSelectedStructure);
  const clippingPlanes = useContext(ClippingPlanesContext);
  const { targetVisible, systemOpacity } = useContext(SystemOpacityContext);

  const meshRef = useRef<THREE.Mesh>(null!);
  const currentOpacity = useRef(targetVisible ? (opacity ?? 1) * systemOpacity : 0);
  const prevTransparent = useRef(true);
  const prevSide = useRef<THREE.Side>(THREE.DoubleSide);

  // Register mesh for outline effect
  useEffect(() => {
    if (meshRef.current) meshRegistry.set(name, meshRef.current);
    return () => { meshRegistry.delete(name); };
  }, [name]);

  const localOpacity = opacity ?? 1;

  // Compute target opacity
  let targetOpacity: number;
  let targetDepthWrite: boolean;
  if (store.xRayMode) {
    targetOpacity = store.isSelected ? 1.0 : store.isHovered ? 0.5 : 0.12;
    targetDepthWrite = store.isSelected;
  } else if (store.isSelected) {
    // Selected structure always fully visible regardless of system opacity
    targetOpacity = localOpacity;
    targetDepthWrite = true;
  } else {
    targetOpacity = targetVisible ? systemOpacity * localOpacity : 0;
    targetDepthWrite = targetOpacity >= 0.99;
  }

  // Per-frame animation — reads store imperatively for hot-path values
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

    // Only set needsUpdate when transparent/side actually changes
    const newTransparent = op < 0.99;
    const newSide = op < 0.99 ? THREE.DoubleSide : THREE.FrontSide;
    if (newTransparent !== prevTransparent.current || newSide !== prevSide.current) {
      mat.transparent = newTransparent;
      mat.side = newSide;
      mat.depthWrite = store.xRayMode ? targetDepthWrite : op >= 0.99;
      mat.needsUpdate = true;
      prevTransparent.current = newTransparent;
      prevSide.current = newSide;
    } else {
      mat.depthWrite = store.xRayMode ? targetDepthWrite : op >= 0.99;
    }

    // Highlight — tint base color AND add emissive glow
    const baseColor = _tmpColor.set(color);
    if (store.isWarning) {
      mat.color.copy(WARNING_COLOR);
      mat.emissive.copy(WARNING_COLOR);
      mat.emissiveIntensity = Math.sin(clock.elapsedTime * 3) * 0.2 + 0.35;
    } else if (store.highlightColor) {
      mat.color.copy(baseColor);
      mat.emissive.set(store.highlightColor);
      mat.emissiveIntensity = 0.4;
    } else if (store.isSelected) {
      mat.color.copy(baseColor).lerp(SELECT_COLORS[system], 0.55);
      mat.emissive.copy(SELECT_COLORS[system]);
      mat.emissiveIntensity = 0.9;
    } else if (store.isHovered) {
      mat.color.copy(baseColor).lerp(HOVER_COLOR, 0.45);
      mat.emissive.copy(HOVER_COLOR);
      mat.emissiveIntensity = 0.5;
    } else {
      mat.color.copy(baseColor);
      mat.emissive.copy(BLACK);
      mat.emissiveIntensity = 0;
    }

    meshRef.current.visible = op > 0.003;
  });

  // Stable material — only varies by system type (not per-frame values)
  const matProps = useMemo(() => ({
    roughness: roughness ?? (system === "organs" ? 0.45 : system === "skeletal" ? 0.8 : system === "arterial" || system === "venous" ? 0.3 : 0.5),
    metalness: metalness ?? (system === "arterial" || system === "venous" ? 0.1 : 0.05),
    clearcoat: system === "organs" ? 0.3 : system === "skeletal" ? 0.1 : 0,
    clippingPlanes: clippingPlanes.length > 0 ? clippingPlanes : undefined,
  }), [system, roughness, metalness, clippingPlanes]);

  // Don't raycast structures that are effectively invisible
  const isRaycastable = targetOpacity > 0.01;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh
        ref={meshRef}
        visible={isRaycastable}
        raycast={isRaycastable ? undefined : () => {}}
        geometry={geometry}
        onPointerOver={(e) => { e.stopPropagation(); setHover(name); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHover(null); document.body.style.cursor = "default"; }}
        onClick={(e) => { e.stopPropagation(); setSelected({ id: name, name, system, description, clinicalSignificance }); }}
        onContextMenu={(e) => {
          e.stopPropagation();
          const nativeEvent = e.nativeEvent as unknown as MouseEvent;
          useAppStore.getState().setContextMenu({
            x: (nativeEvent as any).clientX ?? e.point.x,
            y: (nativeEvent as any).clientY ?? e.point.y,
            name,
            system,
          });
        }}
      >
        {children}
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={1}
          side={THREE.DoubleSide}
          {...matProps}
        />
      </mesh>
    </group>
  );
});

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
