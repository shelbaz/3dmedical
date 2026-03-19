import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";
import { PelvicModel } from "./PelvicModel";

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 50 }}
      style={{ background: "#0a0a0f" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 4, -5]} intensity={0.3} />
      <pointLight position={[0, -2, 0]} intensity={0.2} color="#4a9eff" />

      <PelvicModel />

      <Grid
        args={[20, 20]}
        position={[0, -2, 0]}
        cellColor="#1a1a2e"
        sectionColor="#2a2a3e"
        fadeDistance={15}
        fadeStrength={1}
      />

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={1.5}
        maxDistance={12}
        target={[0, 0, 0]}
      />

      <Environment preset="studio" />
    </Canvas>
  );
}
