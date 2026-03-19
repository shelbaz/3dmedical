import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useAppStore } from "../../store/useAppStore";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const CAMERA_PRESETS: Record<
  string,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  anterior: { position: [0, 0.5, 5.5], target: [0, 0, 0] },
  posterior: { position: [0, 0.5, -5.5], target: [0, 0, 0] },
  left: { position: [-5.5, 0.5, 0], target: [0, 0, 0] },
  right: { position: [5.5, 0.5, 0], target: [0, 0, 0] },
  superior: { position: [0, 6, 0.01], target: [0, 0, 0] },
  inferior: { position: [0, -6, 0.01], target: [0, 0, 0] },
};

export function CameraController() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraPreset = useAppStore((s) => s.cameraPreset);
  const setCameraPreset = useAppStore((s) => s.setCameraPreset);
  const focusTarget = useAppStore((s) => s.focusTarget);
  const setFocusTarget = useAppStore((s) => s.setFocusTarget);

  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const isAnimating = useRef(false);
  const { camera } = useThree();

  // Camera preset
  useEffect(() => {
    if (cameraPreset && CAMERA_PRESETS[cameraPreset]) {
      const preset = CAMERA_PRESETS[cameraPreset];
      targetPos.current.set(...preset.position);
      targetLookAt.current.set(...preset.target);
      isAnimating.current = true;
    }
  }, [cameraPreset]);

  // Focus target (from search)
  useEffect(() => {
    if (focusTarget) {
      const focusPoint = new THREE.Vector3(...focusTarget);
      const dir = new THREE.Vector3()
        .subVectors(camera.position, controlsRef.current?.target ?? new THREE.Vector3())
        .normalize();
      targetPos.current.copy(focusPoint).add(dir.multiplyScalar(3));
      targetLookAt.current.set(...focusTarget);
      isAnimating.current = true;
    }
  }, [focusTarget, camera]);

  useFrame(() => {
    if (!isAnimating.current || !controlsRef.current) return;

    const lerpFactor = 0.06;
    camera.position.lerp(targetPos.current, lerpFactor);
    controlsRef.current.target.lerp(targetLookAt.current, lerpFactor);
    controlsRef.current.update();

    if (
      camera.position.distanceTo(targetPos.current) < 0.02 &&
      controlsRef.current.target.distanceTo(targetLookAt.current) < 0.02
    ) {
      isAnimating.current = false;
      if (cameraPreset) setCameraPreset(null);
      if (focusTarget) setFocusTarget(null);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={1.5}
      maxDistance={15}
      target={[0, 0, 0]}
    />
  );
}
