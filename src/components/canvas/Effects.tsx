import { useAppStore } from "../../store/useAppStore";
import { SYSTEM_COLORS } from "../../types/anatomy";
import { useShallow } from "zustand/shallow";
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
  // Single batched selector
  const { hoveredStructure, selectedStructure, highlightedStructures } = useAppStore(
    useShallow((s) => ({
      hoveredStructure: s.hoveredStructure,
      selectedStructure: s.selectedStructure,
      highlightedStructures: s.highlightedStructures,
    }))
  );

  const { outlineTargets, edgeColor, hiddenColor } = useMemo(() => {
    const names: string[] = [...highlightedStructures];
    // Use bright system color for outline — hover gets white for max contrast
    let color = "#ffffff";

    if (selectedStructure) {
      names.push(selectedStructure.name);
      color = SYSTEM_COLORS[selectedStructure.system];
    }
    if (hoveredStructure && !names.includes(hoveredStructure)) {
      names.push(hoveredStructure);
      // Hover outline is white for maximum visibility
      if (!selectedStructure) color = "#ffffff";
    }

    const meshes: THREE.Mesh[] = [];
    for (const name of names) {
      const mesh = meshRegistry.get(name);
      if (mesh) meshes.push(mesh);
    }

    const c = new THREE.Color(color);
    return {
      outlineTargets: meshes,
      edgeColor: c.getHex(),
      hiddenColor: c.clone().multiplyScalar(0.4).getHex(),
    };
  }, [hoveredStructure, selectedStructure, highlightedStructures]);

  return (
    <EffectComposer multisampling={0} enableNormalPass>
      <SSAO
        blendFunction={BlendFunction.MULTIPLY}
        samples={8}
        radius={0.06}
        intensity={6}
      />
      <Outline
        selection={outlineTargets}
        edgeStrength={outlineTargets.length > 0 ? 6 : 0}
        pulseSpeed={0}
        visibleEdgeColor={edgeColor}
        hiddenEdgeColor={hiddenColor}
        blur
        width={1200}
        xRay
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
