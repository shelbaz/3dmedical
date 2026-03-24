import { Suspense } from "react";
import { GLTFPelvicModel, GLTFMuscleModel } from "./GLTFModel";
import { MuscularSystem, FasciaSystem } from "./StructuralSystems";
import { ArterialSystem, VenousSystem, NervousSystem, LymphaticSystem } from "./VascularSystems";
import { SpacesSystem, SupplementaryOrgans } from "./VisceralSystems";

export function PelvicModel() {
  return (
    <group>
      {/* Real 3D meshes: pelvis bones, sacrum, coccyx, uterus, bladder, arteries, nerves */}
      <Suspense fallback={null}>
        <GLTFPelvicModel />
      </Suspense>

      {/* Real 3D meshes: pelvic floor muscles from MRI */}
      <Suspense fallback={null}>
        <GLTFMuscleModel />
      </Suspense>

      {/* Procedural organs NOT covered by GLTF: cervix, vagina, urethra, rectum, anal canal */}
      <SupplementaryOrgans />

      {/* Fully procedural systems */}
      <MuscularSystem />
      <ArterialSystem />
      <VenousSystem />
      <NervousSystem />
      <LymphaticSystem />
      <FasciaSystem />
      <SpacesSystem />
    </group>
  );
}
