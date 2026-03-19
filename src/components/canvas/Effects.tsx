import { useAppStore } from "../../store/useAppStore";
import { SYSTEM_COLORS } from "../../types/anatomy";
import {
  EffectComposer,
  Outline,
  SSAO,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode, BlendFunction } from "postprocessing";
import * as THREE from "three";
import { useMemo } from "react";
import { meshRegistry } from "./utils";

export function Effects() {
  const hoveredStructure = useAppStore((s) => s.hoveredStructure);
  const selectedStructure = useAppStore((s) => s.selectedStructure);
  const highlightedStructures = useAppStore((s) => s.highlightedStructures);

  const { outlineTargets, outlineColor } = useMemo(() => {
    const names: string[] = [...highlightedStructures];
    let color = "#ffffff";

    if (selectedStructure) {
      names.push(selectedStructure.name);
      color = SYSTEM_COLORS[selectedStructure.system];
    }
    if (hoveredStructure && !names.includes(hoveredStructure)) {
      names.push(hoveredStructure);
    }

    const meshes: THREE.Mesh[] = [];
    for (const name of names) {
      const mesh = meshRegistry.get(name);
      if (mesh) meshes.push(mesh);
    }
    return { outlineTargets: meshes, outlineColor: color };
  }, [hoveredStructure, selectedStructure, highlightedStructures]);

  const edgeColor = useMemo(
    () => new THREE.Color(outlineColor).getHex(),
    [outlineColor]
  );
  const hiddenColor = useMemo(
    () =>
      new THREE.Color(outlineColor).multiplyScalar(0.4).getHex(),
    [outlineColor]
  );

  return (
    <EffectComposer multisampling={4} enableNormalPass>
      <SSAO
        blendFunction={BlendFunction.MULTIPLY}
        samples={21}
        radius={0.05}
        intensity={15}
      />
      <Outline
        selection={outlineTargets}
        edgeStrength={outlineTargets.length > 0 ? 3 : 0}
        pulseSpeed={0}
        visibleEdgeColor={edgeColor}
        hiddenEdgeColor={hiddenColor}
        blur
        xRay={false}
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
