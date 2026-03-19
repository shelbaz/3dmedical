import { SkeletalSystem, MuscularSystem, FasciaSystem } from "./StructuralSystems";
import { ArterialSystem, VenousSystem, NervousSystem, LymphaticSystem } from "./VascularSystems";
import { OrganSystem, SpacesSystem } from "./VisceralSystems";

export function PelvicModel() {
  return (
    <group>
      <SkeletalSystem />
      <MuscularSystem />
      <ArterialSystem />
      <VenousSystem />
      <NervousSystem />
      <LymphaticSystem />
      <OrganSystem />
      <FasciaSystem />
      <SpacesSystem />
    </group>
  );
}
