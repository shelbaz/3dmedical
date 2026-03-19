import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useAppStore } from "../../store/useAppStore";
import { SYSTEM_COLORS } from "../../types/anatomy";
import type { AnatomicalSystem, StructureInfo } from "../../types/anatomy";

/**
 * Placeholder 3D model with representative geometry for each anatomical system.
 * These will be replaced with real GLB models loaded via useGLTF.
 */

function StructureMesh({
  name,
  system,
  position,
  geometry,
  color,
  opacity = 1,
  description,
}: {
  name: string;
  system: AnatomicalSystem;
  position: [number, number, number];
  geometry: THREE.BufferGeometry;
  color: string;
  opacity?: number;
  description?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { hoveredStructure, setHoveredStructure, setSelectedStructure } =
    useAppStore();
  const isHovered = hoveredStructure === name;

  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={geometry}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredStructure(name);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHoveredStructure(null);
        document.body.style.cursor = "default";
      }}
      onClick={(e) => {
        e.stopPropagation();
        const info: StructureInfo = {
          id: name,
          name,
          system,
          description,
        };
        setSelectedStructure(info);
      }}
    >
      <meshStandardMaterial
        color={isHovered ? "#ffffff" : color}
        transparent={opacity < 1}
        opacity={opacity}
        emissive={isHovered ? color : "#000000"}
        emissiveIntensity={isHovered ? 0.3 : 0}
        side={opacity < 1 ? THREE.DoubleSide : THREE.FrontSide}
      />
      {isHovered && (
        <Html center distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1 text-xs text-[var(--text-primary)] whitespace-nowrap shadow-lg">
            {name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

function SystemGroup({
  system,
  children,
}: {
  system: AnatomicalSystem;
  children: React.ReactNode;
}) {
  const visible = useAppStore((s) => s.visibleSystems[system]);
  return <group visible={visible}>{children}</group>;
}

export function PelvicModel() {
  const groupRef = useRef<THREE.Group>(null);

  // Slow auto-rotation when not interacting
  useFrame((_, delta) => {
    if (groupRef.current) {
      // no auto-rotation — user controls only
    }
  });

  return (
    <group ref={groupRef}>
      {/* SKELETAL - Bony pelvis placeholder */}
      <SystemGroup system="skeletal">
        {/* Pelvic ring */}
        <StructureMesh
          name="Pelvic Ring (Os Coxae)"
          system="skeletal"
          position={[0, 0, 0]}
          geometry={new THREE.TorusGeometry(1.2, 0.15, 16, 32)}
          color={SYSTEM_COLORS.skeletal}
          description="The bony pelvis formed by the two hip bones (os coxae), sacrum, and coccyx."
        />
        {/* Sacrum */}
        <StructureMesh
          name="Sacrum"
          system="skeletal"
          position={[0, 0.3, -0.9]}
          geometry={new THREE.ConeGeometry(0.5, 1.0, 4)}
          color={SYSTEM_COLORS.skeletal}
          description="Triangular bone at the base of the spine, formed by fusion of S1-S5 vertebrae."
        />
        {/* Pubic symphysis */}
        <StructureMesh
          name="Pubic Symphysis"
          system="skeletal"
          position={[0, -0.1, 1.15]}
          geometry={new THREE.BoxGeometry(0.2, 0.3, 0.15)}
          color={SYSTEM_COLORS.skeletal}
          description="Cartilaginous joint between the two pubic bones anteriorly."
        />
      </SystemGroup>

      {/* MUSCULAR - Pelvic floor muscles */}
      <SystemGroup system="muscular">
        {/* Levator Ani - bowl shape */}
        <StructureMesh
          name="Levator Ani"
          system="muscular"
          position={[0, -0.6, 0]}
          geometry={new THREE.SphereGeometry(0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)}
          color={SYSTEM_COLORS.muscular}
          description="The primary muscle of the pelvic floor. Composed of pubococcygeus, puborectalis, and iliococcygeus."
        />
        {/* Obturator Internus */}
        <StructureMesh
          name="Obturator Internus"
          system="muscular"
          position={[-1.0, 0, 0.3]}
          geometry={new THREE.BoxGeometry(0.15, 0.8, 0.6)}
          color="#b83838"
          description="Pelvic wall muscle. Its fascia forms the lateral wall of the ischioanal fossa and gives rise to the arcus tendineus levator ani."
        />
        <StructureMesh
          name="Obturator Internus (R)"
          system="muscular"
          position={[1.0, 0, 0.3]}
          geometry={new THREE.BoxGeometry(0.15, 0.8, 0.6)}
          color="#b83838"
          description="Right obturator internus muscle."
        />
        {/* Piriformis */}
        <StructureMesh
          name="Piriformis"
          system="muscular"
          position={[0, 0.4, -0.7]}
          geometry={new THREE.BoxGeometry(1.4, 0.12, 0.35)}
          color="#a03030"
          description="Posterior pelvic wall muscle. Exits through the greater sciatic foramen. Sciatic nerve passes inferior to it."
        />
      </SystemGroup>

      {/* ARTERIAL - Major arteries */}
      <SystemGroup system="arterial">
        {/* Internal Iliac - L */}
        <StructureMesh
          name="Internal Iliac Artery (L)"
          system="arterial"
          position={[-0.8, 0.8, -0.3]}
          geometry={new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8)}
          color={SYSTEM_COLORS.arterial}
          description="Main arterial supply to the pelvis. Divides into anterior and posterior divisions."
        />
        {/* Internal Iliac - R */}
        <StructureMesh
          name="Internal Iliac Artery (R)"
          system="arterial"
          position={[0.8, 0.8, -0.3]}
          geometry={new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8)}
          color={SYSTEM_COLORS.arterial}
          description="Right internal iliac artery."
        />
        {/* Uterine Artery */}
        <StructureMesh
          name="Uterine Artery"
          system="arterial"
          position={[-0.4, 0, 0.2]}
          geometry={new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(0, -0.4, 0),
              new THREE.Vector3(0.2, 0, 0.1),
              new THREE.Vector3(0, 0.4, 0),
            ]),
            20, 0.025, 8
          )}
          color={SYSTEM_COLORS.arterial}
          description="Key gynecologic vessel. Crosses ureter superiorly ('water under the bridge') ~1-2cm lateral to cervix."
        />
        {/* Internal Pudendal */}
        <StructureMesh
          name="Internal Pudendal Artery"
          system="arterial"
          position={[-0.9, -0.5, -0.3]}
          geometry={new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8)}
          color="#ef4444"
          description="Exits greater sciatic foramen below piriformis, hooks around ischial spine, enters Alcock's canal. Supplies perineum."
        />
      </SystemGroup>

      {/* VENOUS */}
      <SystemGroup system="venous">
        <StructureMesh
          name="Internal Iliac Vein (L)"
          system="venous"
          position={[-0.6, 0.8, -0.2]}
          geometry={new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8)}
          color={SYSTEM_COLORS.venous}
          description="Main venous drainage of the pelvis."
        />
        <StructureMesh
          name="Internal Iliac Vein (R)"
          system="venous"
          position={[0.6, 0.8, -0.2]}
          geometry={new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8)}
          color={SYSTEM_COLORS.venous}
          description="Right internal iliac vein."
        />
        <StructureMesh
          name="Uterine Venous Plexus"
          system="venous"
          position={[0, -0.1, 0.3]}
          geometry={new THREE.SphereGeometry(0.25, 16, 16)}
          color="#60a5fa"
          description="Extensive venous plexus along lateral uterine walls. Drains via uterine veins to internal iliac vein."
        />
        <StructureMesh
          name="Presacral Venous Plexus"
          system="venous"
          position={[0, 0.2, -0.85]}
          geometry={new THREE.PlaneGeometry(0.6, 0.8)}
          color="#2563eb"
          opacity={0.6}
          description="Thin-walled valveless veins on sacral surface. Catastrophic hemorrhage if injured during presacral dissection."
        />
      </SystemGroup>

      {/* NERVOUS */}
      <SystemGroup system="nervous">
        <StructureMesh
          name="Sacral Plexus (L4-S4)"
          system="nervous"
          position={[0, 0.5, -0.6]}
          geometry={new THREE.PlaneGeometry(0.8, 0.6)}
          color={SYSTEM_COLORS.nervous}
          opacity={0.7}
          description="Formed by ventral rami of L4-S4. Gives rise to sciatic, pudendal, and obturator nerves among others."
        />
        <StructureMesh
          name="Pudendal Nerve (S2-S4)"
          system="nervous"
          position={[-0.85, -0.3, -0.5]}
          geometry={new THREE.CylinderGeometry(0.015, 0.015, 1.2, 8)}
          color={SYSTEM_COLORS.nervous}
          description="Exits greater sciatic foramen, wraps around ischial spine, enters Alcock's canal. Supplies external anal sphincter, perineal muscles, clitoris."
        />
        <StructureMesh
          name="Obturator Nerve (L2-L4)"
          system="nervous"
          position={[-1.05, 0.3, 0.4]}
          geometry={new THREE.CylinderGeometry(0.015, 0.015, 0.9, 8)}
          color="#ca8a04"
          description="Descends along lateral pelvic wall, exits through obturator canal. At risk during pelvic lymphadenectomy."
        />
        <StructureMesh
          name="Inferior Hypogastric Plexus"
          system="nervous"
          position={[-0.5, -0.1, -0.3]}
          geometry={new THREE.SphereGeometry(0.15, 12, 12)}
          color="#a16207"
          opacity={0.6}
          description="Bilateral pelvic plexus receiving hypogastric nerves (sympathetic) and pelvic splanchnic nerves (parasympathetic S2-S4). At risk during radical hysterectomy."
        />
      </SystemGroup>

      {/* LYMPHATIC */}
      <SystemGroup system="lymphatic">
        {/* External iliac nodes */}
        <StructureMesh
          name="External Iliac Nodes"
          system="lymphatic"
          position={[-0.9, 1.0, 0.2]}
          geometry={new THREE.SphereGeometry(0.08, 12, 12)}
          color={SYSTEM_COLORS.lymphatic}
          description="Along external iliac vessels. Drain upper bladder, upper vagina, cervix, uterine body."
        />
        {/* Obturator nodes */}
        <StructureMesh
          name="Obturator Nodes"
          system="lymphatic"
          position={[-1.0, 0.2, 0.5]}
          geometry={new THREE.SphereGeometry(0.07, 12, 12)}
          color={SYSTEM_COLORS.lymphatic}
          description="Within obturator fossa. Most common site of nodal metastasis in cervical cancer. First nodes removed in pelvic lymphadenectomy."
        />
        {/* Internal iliac nodes */}
        <StructureMesh
          name="Internal Iliac Nodes"
          system="lymphatic"
          position={[-0.7, 0.6, -0.4]}
          geometry={new THREE.SphereGeometry(0.07, 12, 12)}
          color={SYSTEM_COLORS.lymphatic}
          description="Along internal iliac vessels. Drain pelvic viscera, cervix, lower uterus, upper vagina."
        />
        {/* Presacral nodes */}
        <StructureMesh
          name="Presacral Nodes"
          system="lymphatic"
          position={[0, 0.4, -0.8]}
          geometry={new THREE.SphereGeometry(0.06, 12, 12)}
          color={SYSTEM_COLORS.lymphatic}
          description="Anterior to sacrum. Drain rectum, posterior cervix. Important in rectal and cervical cancer staging."
        />
      </SystemGroup>

      {/* ORGANS */}
      <SystemGroup system="organs">
        {/* Uterus */}
        <StructureMesh
          name="Uterus"
          system="organs"
          position={[0, 0.3, 0.2]}
          geometry={new THREE.ConeGeometry(0.3, 0.6, 16)}
          color={SYSTEM_COLORS.organs}
          description="Pear-shaped muscular organ. Parts: fundus, body, isthmus, cervix. Primary support from cardinal and uterosacral ligaments."
        />
        {/* Cervix */}
        <StructureMesh
          name="Cervix"
          system="organs"
          position={[0, -0.1, 0.2]}
          geometry={new THREE.CylinderGeometry(0.15, 0.18, 0.3, 16)}
          color="#e8a090"
          description="Lower portion of uterus. Critical relationships: ureters pass 1-2cm laterally, uterine arteries cross superiorly."
        />
        {/* Vagina */}
        <StructureMesh
          name="Vagina"
          system="organs"
          position={[0, -0.5, 0.4]}
          geometry={new THREE.CylinderGeometry(0.12, 0.14, 0.7, 16)}
          color="#f0b0a0"
          description="Fibromuscular canal. Fornices: anterior, posterior (deepest, related to Pouch of Douglas), lateral. Support via DeLancey levels I-III."
        />
        {/* Bladder */}
        <StructureMesh
          name="Urinary Bladder"
          system="organs"
          position={[0, -0.1, 0.8]}
          geometry={new THREE.SphereGeometry(0.35, 16, 16)}
          color="#f9a8d4"
          opacity={0.8}
          description="Anterior to uterus and vagina. Trigone between ureteric orifices and internal urethral orifice."
        />
        {/* Rectum */}
        <StructureMesh
          name="Rectum"
          system="organs"
          position={[0, -0.1, -0.5]}
          geometry={new THREE.CylinderGeometry(0.18, 0.22, 1.0, 16)}
          color="#d4a08a"
          description="~12-15cm, begins at S3. Mesorectum contains perirectal fat, lymph nodes, superior rectal vessels."
        />
        {/* Ovaries */}
        <StructureMesh
          name="Ovary (L)"
          system="organs"
          position={[-0.7, 0.3, 0.3]}
          geometry={new THREE.SphereGeometry(0.12, 12, 12)}
          color="#fca5a5"
          description="Located in ovarian fossa. Lymphatic drainage directly to para-aortic nodes via ovarian vessels."
        />
        <StructureMesh
          name="Ovary (R)"
          system="organs"
          position={[0.7, 0.3, 0.3]}
          geometry={new THREE.SphereGeometry(0.12, 12, 12)}
          color="#fca5a5"
          description="Right ovary."
        />
      </SystemGroup>

      {/* FASCIA & LIGAMENTS */}
      <SystemGroup system="fascia">
        {/* Cardinal Ligament */}
        <StructureMesh
          name="Cardinal Ligament (L)"
          system="fascia"
          position={[-0.6, -0.05, 0.2]}
          geometry={new THREE.BoxGeometry(0.7, 0.06, 0.15)}
          color={SYSTEM_COLORS.fascia}
          description="Primary Level I support of uterus. Contains uterine artery/vein, ureter, parametrial lymph nodes, autonomic nerves."
        />
        <StructureMesh
          name="Cardinal Ligament (R)"
          system="fascia"
          position={[0.6, -0.05, 0.2]}
          geometry={new THREE.BoxGeometry(0.7, 0.06, 0.15)}
          color={SYSTEM_COLORS.fascia}
          description="Right cardinal (transverse cervical / Mackenrodt's) ligament."
        />
        {/* Uterosacral Ligament */}
        <StructureMesh
          name="Uterosacral Ligament (L)"
          system="fascia"
          position={[-0.3, 0.1, -0.4]}
          geometry={new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8)}
          color="#8b5cf6"
          description="From posterolateral cervix to sacrum (S2-S4). Contains hypogastric nerve fibers. Used in vault suspension procedures."
        />
        <StructureMesh
          name="Uterosacral Ligament (R)"
          system="fascia"
          position={[0.3, 0.1, -0.4]}
          geometry={new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8)}
          color="#8b5cf6"
          description="Right uterosacral ligament."
        />
        {/* Sacrospinous Ligament */}
        <StructureMesh
          name="Sacrospinous Ligament (L)"
          system="fascia"
          position={[-0.7, -0.1, -0.6]}
          geometry={new THREE.CylinderGeometry(0.025, 0.025, 0.9, 8)}
          color="#7c3aed"
          description="From lateral sacrum/coccyx to ischial spine. Pudendal nerve and internal pudendal vessels wrap around its posterior surface."
        />
      </SystemGroup>

      {/* PELVIC SPACES - semi-transparent volumes */}
      <SystemGroup system="spaces">
        {/* Space of Retzius */}
        <StructureMesh
          name="Retropubic Space (Space of Retzius)"
          system="spaces"
          position={[0, -0.1, 1.0]}
          geometry={new THREE.BoxGeometry(0.6, 0.5, 0.3)}
          color={SYSTEM_COLORS.spaces}
          opacity={0.25}
          description="Between pubic symphysis (anterior) and bladder (posterior). Contains dorsal venous complex, corona mortis. Accessed for Burch colposuspension, TVT sling."
        />
        {/* Vesicovaginal Space */}
        <StructureMesh
          name="Vesicovaginal Space"
          system="spaces"
          position={[0, -0.3, 0.6]}
          geometry={new THREE.BoxGeometry(0.5, 0.3, 0.15)}
          color="#22d3ee"
          opacity={0.25}
          description="Between posterior bladder wall and anterior vaginal wall. Dissected during hysterectomy, anterior colporrhaphy, vesicovaginal fistula repair."
        />
        {/* Rectovaginal Space */}
        <StructureMesh
          name="Rectovaginal Space"
          system="spaces"
          position={[0, -0.3, -0.1]}
          geometry={new THREE.BoxGeometry(0.5, 0.4, 0.15)}
          color="#0e7490"
          opacity={0.25}
          description="Between posterior vaginal wall and anterior rectal wall. Avascular plane (Denonvilliers' fascia). Key for posterior colporrhaphy, deep endometriosis excision."
        />
        {/* Pouch of Douglas */}
        <StructureMesh
          name="Pouch of Douglas (Rectouterine Pouch)"
          system="spaces"
          position={[0, 0.1, -0.2]}
          geometry={new THREE.SphereGeometry(0.25, 16, 16)}
          color="#155e75"
          opacity={0.2}
          description="Most dependent peritoneal space in upright position. Common site for fluid collections, endometriosis, enterocele. Accessed via culdocentesis, posterior colpotomy."
        />
        {/* Pararectal Space */}
        <StructureMesh
          name="Pararectal Space (L)"
          system="spaces"
          position={[-0.6, 0, -0.4]}
          geometry={new THREE.BoxGeometry(0.3, 0.5, 0.3)}
          color="#0891b2"
          opacity={0.2}
          description="Medial: ureter/uterosacral lig. Lateral: internal iliac vessels. Developed during radical hysterectomy to expose cardinal ligament."
        />
        {/* Paravesical Space */}
        <StructureMesh
          name="Paravesical Space (L)"
          system="spaces"
          position={[-0.7, 0, 0.6]}
          geometry={new THREE.BoxGeometry(0.3, 0.5, 0.3)}
          color="#06b6d4"
          opacity={0.2}
          description="Medial: bladder/obliterated umbilical a. Lateral: external iliac vessels/obturator internus. Developed during radical hysterectomy, pelvic lymphadenectomy."
        />
        {/* Presacral Space */}
        <StructureMesh
          name="Presacral Space"
          system="spaces"
          position={[0, 0.3, -0.9]}
          geometry={new THREE.BoxGeometry(0.7, 0.6, 0.15)}
          color="#0284c7"
          opacity={0.2}
          description="Between mesorectal fascia and presacral fascia/sacrum. Contains presacral venous plexus, median sacral vessels. Presacral hemorrhage is life-threatening."
        />
        {/* Ischioanal Fossa */}
        <StructureMesh
          name="Ischioanal Fossa (L)"
          system="spaces"
          position={[-0.7, -0.8, -0.1]}
          geometry={new THREE.ConeGeometry(0.3, 0.5, 8)}
          color="#0369a1"
          opacity={0.2}
          description="Contains Alcock's canal (pudendal nerve, internal pudendal vessels) on lateral wall. Site of perianal abscesses, pudendal nerve block."
        />
        {/* Vesicouterine Pouch */}
        <StructureMesh
          name="Vesicouterine Pouch"
          system="spaces"
          position={[0, 0.2, 0.5]}
          geometry={new THREE.SphereGeometry(0.18, 12, 12)}
          color="#38bdf8"
          opacity={0.2}
          description="Between posterior bladder and anterior uterus. Shallower than Pouch of Douglas. Site of peritoneal incision during cesarean section."
        />
      </SystemGroup>
    </group>
  );
}
