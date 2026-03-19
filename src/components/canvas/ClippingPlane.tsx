import { useMemo } from "react";
import { useAppStore } from "../../store/useAppStore";
import * as THREE from "three";

const ORIENTATIONS: Record<
  string,
  { normal: [number, number, number]; label: string }
> = {
  sagittal: { normal: [1, 0, 0], label: "Sagittal (L/R)" },
  coronal: { normal: [0, 0, 1], label: "Coronal (A/P)" },
  axial: { normal: [0, 1, 0], label: "Axial (S/I)" },
};

export function useClippingPlane(): THREE.Plane[] {
  const enabled = useAppStore((s) => s.clippingEnabled);
  const orientation = useAppStore((s) => s.clippingOrientation);
  const position = useAppStore((s) => s.clippingPosition);

  return useMemo(() => {
    if (!enabled) return [];
    const { normal } = ORIENTATIONS[orientation];
    const plane = new THREE.Plane(
      new THREE.Vector3(...normal),
      -position
    );
    return [plane];
  }, [enabled, orientation, position]);
}

export function ClippingPlaneVisual() {
  const enabled = useAppStore((s) => s.clippingEnabled);
  const orientation = useAppStore((s) => s.clippingOrientation);
  const position = useAppStore((s) => s.clippingPosition);

  const rotation = useMemo((): [number, number, number] => {
    switch (orientation) {
      case "sagittal":
        return [0, Math.PI / 2, 0];
      case "coronal":
        return [0, 0, 0];
      case "axial":
        return [Math.PI / 2, 0, 0];
      default:
        return [0, 0, 0];
    }
  }, [orientation]);

  const positionVec = useMemo((): [number, number, number] => {
    switch (orientation) {
      case "sagittal":
        return [position, 0, 0];
      case "coronal":
        return [0, 0, position];
      case "axial":
        return [0, position, 0];
      default:
        return [0, 0, 0];
    }
  }, [orientation, position]);

  if (!enabled) return null;

  return (
    <mesh position={positionVec} rotation={rotation}>
      <planeGeometry args={[5, 5]} />
      <meshBasicMaterial
        color="#3b82f6"
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
