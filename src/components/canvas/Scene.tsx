import { Canvas } from "@react-three/fiber";
import { Environment, Grid, ContactShadows } from "@react-three/drei";
import { PelvicModel } from "./PelvicModel";
import { Effects } from "./Effects";
import { CameraController } from "./CameraController";
import { ClippingPlaneVisual, useClippingPlane } from "./ClippingPlane";
import { ClippingPlanesContext } from "./utils";

function SceneContent() {
  const clippingPlanes = useClippingPlane();

  return (
    <ClippingPlanesContext.Provider value={clippingPlanes}>
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={0.9} castShadow />
      <directionalLight position={[-4, 6, -3]} intensity={0.4} />
      <directionalLight position={[0, -3, 4]} intensity={0.2} />
      <pointLight position={[0, 0, 3]} intensity={0.15} color="#6090ff" />
      <pointLight position={[0, 0, -3]} intensity={0.1} color="#ff9060" />

      <PelvicModel />
      <ClippingPlaneVisual />

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.3}
        scale={8}
        blur={2}
        far={3}
      />

      <Grid
        args={[20, 20]}
        position={[0, -1.5, 0]}
        cellColor="#1a1a2e"
        sectionColor="#2a2a3e"
        fadeDistance={12}
        fadeStrength={1}
      />

      <CameraController />
      <Environment preset="studio" />
      <Effects />
    </ClippingPlanesContext.Provider>
  );
}

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 2.5, 5.5], fov: 45 }}
      style={{ background: "#0a0a0f" }}
      gl={{ localClippingEnabled: true }}
    >
      <SceneContent />
    </Canvas>
  );
}
