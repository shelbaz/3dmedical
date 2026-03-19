import { useMemo } from "react";
import * as THREE from "three";
import { Structure, SystemGroup, makeTube, makeLathe } from "./utils";

// ═══════════════════════════════════════════════════════════════
// ORGAN SYSTEM
// ═══════════════════════════════════════════════════════════════

export function OrganSystem() {
  // Uterus — pear-shaped via LatheGeometry
  const uterusGeo = useMemo(
    () =>
      makeLathe([
        [0.0, 0.0],
        [0.11, 0.04],
        [0.11, 0.22],
        [0.13, 0.28],
        [0.2, 0.38],
        [0.3, 0.52],
        [0.32, 0.62],
        [0.28, 0.72],
        [0.2, 0.78],
        [0.1, 0.83],
        [0.0, 0.86],
      ]),
    []
  );

  // Cervix — cylindrical, slightly wider at the base
  const cervixGeo = useMemo(
    () =>
      makeLathe([
        [0.0, 0.0],
        [0.12, 0.02],
        [0.13, 0.08],
        [0.12, 0.18],
        [0.11, 0.22],
        [0.0, 0.24],
      ]),
    []
  );

  // Vagina — tube following a slight posterior curve
  const vaginaGeo = useMemo(
    () =>
      makeTube(
        [
          [0, -0.15, 0.05],
          [0, -0.35, 0.12],
          [0, -0.55, 0.22],
          [0, -0.75, 0.35],
          [0, -0.9, 0.48],
        ],
        0.1
      ),
    []
  );

  // Bladder — rounded using LatheGeometry
  const bladderGeo = useMemo(
    () =>
      makeLathe([
        [0.0, 0.0],
        [0.15, 0.04],
        [0.28, 0.12],
        [0.35, 0.22],
        [0.36, 0.32],
        [0.32, 0.42],
        [0.22, 0.5],
        [0.1, 0.55],
        [0.0, 0.57],
      ]),
    []
  );

  // Urethra — short tube anterior to vagina
  const urethraGeo = useMemo(
    () =>
      makeTube(
        [
          [0, -0.35, 0.82],
          [0, -0.5, 0.78],
          [0, -0.65, 0.72],
          [0, -0.82, 0.66],
        ],
        0.035
      ),
    []
  );

  // Rectum — following the sacral curve
  const rectumGeo = useMemo(
    () =>
      makeTube(
        [
          [0, 0.7, -0.55],
          [0, 0.45, -0.65],
          [0, 0.2, -0.7],
          [0, -0.05, -0.68],
          [0, -0.3, -0.6],
          [0, -0.55, -0.52],
          [0, -0.75, -0.45],
        ],
        0.13,
        48
      ),
    []
  );

  // Anal canal — straight tube below rectum
  const analCanalGeo = useMemo(
    () =>
      makeTube(
        [
          [0, -0.75, -0.45],
          [0, -0.88, -0.43],
          [0, -1.0, -0.42],
        ],
        0.08
      ),
    []
  );

  // Fallopian tubes — curved from uterine cornua to ovaries
  const tubeLGeo = useMemo(
    () =>
      makeTube(
        [
          [-0.28, 0.48, 0.18],
          [-0.4, 0.52, 0.15],
          [-0.5, 0.5, 0.12],
          [-0.58, 0.44, 0.15],
          [-0.62, 0.38, 0.2],
          [-0.65, 0.32, 0.2],
        ],
        0.025
      ),
    []
  );
  const tubeRGeo = useMemo(
    () =>
      makeTube(
        [
          [0.28, 0.48, 0.18],
          [0.4, 0.52, 0.15],
          [0.5, 0.5, 0.12],
          [0.58, 0.44, 0.15],
          [0.62, 0.38, 0.2],
          [0.65, 0.32, 0.2],
        ],
        0.025
      ),
    []
  );

  // Fimbriae — small fan at the end of each tube
  const fimbriaeGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 10; i++) {
      const t = (i / 10) * Math.PI * 0.8 - Math.PI * 0.4;
      pts.push(new THREE.Vector3(0.08 * Math.cos(t), 0.08 * Math.sin(t), 0));
    }
    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(pts),
      12,
      0.012,
      6,
      false
    );
  }, []);

  // Ureters — thin tubes entering pelvis and coursing to bladder
  const ureterLGeo = useMemo(
    () =>
      makeTube(
        [
          [-0.55, 1.2, -0.3],
          [-0.6, 0.9, -0.2],
          [-0.55, 0.6, -0.1],
          [-0.45, 0.3, 0.05],
          [-0.3, 0.05, 0.15],
          [-0.2, -0.1, 0.35],
          [-0.12, -0.2, 0.6],
          [-0.08, -0.25, 0.75],
        ],
        0.022
      ),
    []
  );
  const ureterRGeo = useMemo(
    () =>
      makeTube(
        [
          [0.55, 1.2, -0.3],
          [0.6, 0.9, -0.2],
          [0.55, 0.6, -0.1],
          [0.45, 0.3, 0.05],
          [0.3, 0.05, 0.15],
          [0.2, -0.1, 0.35],
          [0.12, -0.2, 0.6],
          [0.08, -0.25, 0.75],
        ],
        0.022
      ),
    []
  );

  return (
    <SystemGroup system="organs">
      <Structure name="Uterus" system="organs" geometry={uterusGeo} position={[0, -0.15, 0.15]} rotation={[-0.25, 0, 0]} color="#f59e8b" roughness={0.45} description="Pear-shaped muscular organ. Parts: fundus, body, isthmus, cervix. Typically anteverted and anteflexed. Three-layered wall: endometrium, myometrium (3 layers), perimetrium." clinicalSignificance="Primary support: cardinal ligaments (Level I), uterosacral ligaments. Uterine artery is primary blood supply; ovarian artery provides collateral at fundus." />

      <Structure name="Cervix" system="organs" geometry={cervixGeo} position={[0, -0.4, 0.05]} color="#e8a090" roughness={0.45} description="Lower portion of the uterus. Supravaginal and vaginal (portio/ectocervix) portions. Squamocolumnar junction (transformation zone) is where cervical neoplasia develops." clinicalSignificance="Critical surgical relationships: ureters 1-2cm laterally, uterine arteries cross superiorly, parametrium attaches laterally." />

      <Structure name="Vagina" system="organs" geometry={vaginaGeo} color="#f0b0a0" opacity={0.8} roughness={0.45} description="Fibromuscular canal ~7-10cm. Fornices: anterior, posterior (deepest — related to Pouch of Douglas), lateral. DeLancey support: Level I (apex), II (mid — paravaginal), III (distal — perineal body)." clinicalSignificance="Posterior fornix is thinnest point to peritoneal cavity — used for culdocentesis. Support defects at each DeLancey level produce different prolapse types." />

      <Structure name="Urinary Bladder" system="organs" geometry={bladderGeo} position={[0, -0.3, 0.85]} color="#f9a8d4" opacity={0.75} roughness={0.45} description="Muscular reservoir. Trigone between two ureteric orifices and internal urethral orifice. Relations: superior — uterus, anterior — retropubic space, posterior — cervix/anterior vaginal wall." clinicalSignificance="Parasympathetic (S2-S4) contracts detrusor; sympathetic relaxes it. Radical hysterectomy can denervate the bladder. Mobilized inferiorly during cesarean section." />

      <Structure name="Urethra" system="organs" geometry={urethraGeo} color="#f9a8d4" roughness={0.45} description="Female urethra ~3-4cm. Courses through anterior vaginal wall. Sphincter complex: internal (smooth, involuntary) and external (rhabdosphincter, voluntary)." />

      <Structure name="Rectum" system="organs" geometry={rectumGeo} color="#d4a08a" roughness={0.45} description="~12-15cm. Follows sacral curve. Three transverse folds (valves of Houston). Surrounded by mesorectal fat (lymph nodes, superior rectal vessels) enclosed by mesorectal fascia." clinicalSignificance="Total mesorectal excision (TME) dissects in the avascular plane between mesorectal and parietal pelvic fascia. No serosa below the peritoneal reflection." />

      <Structure name="Anal Canal" system="organs" geometry={analCanalGeo} color="#c49a80" roughness={0.45} description="~3-4cm. Dentate (pectinate) line divides upper (columnar, visceral innervation, portal drainage) from lower (squamous, somatic/pudendal innervation, systemic drainage)." clinicalSignificance="Above dentate: internal iliac node drainage. Below dentate: superficial inguinal node drainage. Critical for cancer staging." />

      <Structure name="Ovary (L)" system="organs" position={[-0.68, 0.28, 0.18]} scale={[1, 1.3, 0.7]} color="#fca5a5" roughness={0.4} description="In the ovarian fossa (bounded by external iliac vessels superiorly, internal iliac posteriorly, obliterated umbilical artery anteriorly). Lymphatics drain DIRECTLY to para-aortic nodes via ovarian vessels." clinicalSignificance="Direct para-aortic drainage means ovarian cancer staging requires para-aortic lymphadenectomy. Left ovarian vein → left renal vein; right → IVC directly.">
        <sphereGeometry args={[0.1, 16, 16]} />
      </Structure>
      <Structure name="Ovary (R)" system="organs" position={[0.68, 0.28, 0.18]} scale={[1, 1.3, 0.7]} color="#fca5a5" roughness={0.4} description="Right ovary. Right ovarian vein drains directly to IVC.">
        <sphereGeometry args={[0.1, 16, 16]} />
      </Structure>

      <Structure name="Fallopian Tube (L)" system="organs" geometry={tubeLGeo} color="#f0a0a0" roughness={0.4} description="Parts: intramural, isthmus, ampulla (fertilization site), infundibulum with fimbriae. Supported by mesosalpinx." />
      <Structure name="Fallopian Tube (R)" system="organs" geometry={tubeRGeo} color="#f0a0a0" roughness={0.4} description="Right fallopian tube." />

      <Structure name="Fimbriae (L)" system="organs" geometry={fimbriaeGeo} position={[-0.65, 0.32, 0.2]} rotation={[0, 0.5, 0.3]} color="#f0a0a0" roughness={0.4} description="Finger-like projections at the end of the fallopian tube that sweep over the ovarian surface to capture the oocyte." />
      <Structure name="Fimbriae (R)" system="organs" geometry={fimbriaeGeo} position={[0.65, 0.32, 0.2]} rotation={[0, -0.5, -0.3]} color="#f0a0a0" roughness={0.4} description="Right fimbriae." />

      <Structure name="Ureter (L)" system="organs" geometry={ureterLGeo} color="#e8c080" roughness={0.45} description="Enters pelvis at common iliac bifurcation. Five pelvic segments: parietal, retroligamentous, intraligamentous (within cardinal ligament), retrovesical, intravesical." clinicalSignificance="THREE classic injury sites: (1) pelvic brim under IP ligament, (2) cardinal ligament where uterine artery crosses ('water under the bridge'), (3) intramural segment at bladder entry. Passes 0.9-2.3cm lateral to uterosacral ligament." />
      <Structure name="Ureter (R)" system="organs" geometry={ureterRGeo} color="#e8c080" roughness={0.45} description="Right ureter." />
    </SystemGroup>
  );
}

// ═══════════════════════════════════════════════════════════════
// PELVIC SPACES SYSTEM
// ═══════════════════════════════════════════════════════════════

export function SpacesSystem() {
  // Retropubic space (Space of Retzius) — between pubis and bladder
  const retropubicGeo = useMemo(
    () =>
      makeTube(
        [
          [-0.25, 0.1, 1.15],
          [0, 0.1, 1.12],
          [0.25, 0.1, 1.15],
        ],
        0.18,
        12
      ),
    []
  );

  // Vesicovaginal space — thin slab between bladder and vagina
  const vesicovaginalGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.2, -0.15);
    shape.lineTo(0.2, -0.15);
    shape.lineTo(0.2, 0.2);
    shape.lineTo(-0.2, 0.2);
    shape.lineTo(-0.2, -0.15);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: false });
  }, []);

  // Rectovaginal space — between vagina and rectum
  const rectovaginalGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.2, -0.25);
    shape.lineTo(0.2, -0.25);
    shape.lineTo(0.18, 0.2);
    shape.lineTo(-0.18, 0.2);
    shape.lineTo(-0.2, -0.25);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: false });
  }, []);

  const cyan = "#06b6d4";

  return (
    <SystemGroup system="spaces">
      <Structure name="Retropubic Space (Space of Retzius)" system="spaces" geometry={retropubicGeo} color={cyan} opacity={0.2} roughness={0.7} description="Between posterior pubic symphysis and anterior bladder wall. Contains dorsal venous complex, corona mortis, retropubic venous plexus." clinicalSignificance="Accessed for Burch colposuspension, TVT sling, radical cystectomy, paravaginal defect repair. Hemorrhage from venous plexus and corona mortis is the primary danger." />

      <Structure name="Vesicovaginal Space" system="spaces" geometry={vesicovaginalGeo} position={[0, -0.3, 0.55]} color="#22d3ee" opacity={0.2} roughness={0.7} description="Between posterior bladder wall (vesical fascia) and anterior vaginal wall (pubocervical fascia)." clinicalSignificance="Dissected during hysterectomy, anterior colporrhaphy, vesicovaginal fistula repair. Lateral dissection risks ureteric injury." />

      <Structure name="Rectovaginal Space" system="spaces" geometry={rectovaginalGeo} position={[0, -0.35, -0.2]} color="#0e7490" opacity={0.2} roughness={0.7} description="Between posterior vaginal wall (rectovaginal/Denonvilliers' fascia) and anterior rectal wall (mesorectal fascia). Avascular dissection plane." clinicalSignificance="Key plane for posterior colporrhaphy, deep endometriosis excision, radical hysterectomy, low anterior resection. Rectovaginal fistulae occur here." />

      <Structure name="Pouch of Douglas (Rectouterine Pouch)" system="spaces" position={[0, 0.05, -0.2]} color="#155e75" opacity={0.18} roughness={0.7} description="Most dependent peritoneal space upright. Between posterior uterus and anterior rectum. Bounded laterally by uterosacral folds." clinicalSignificance="Fluid collections (blood, pus, ascites), endometriosis, enterocele. Accessed by culdocentesis, posterior colpotomy. Posterior fornix is separated from it by only vaginal wall and peritoneum.">
        <sphereGeometry args={[0.22, 16, 16]} />
      </Structure>

      <Structure name="Pararectal Space (L)" system="spaces" position={[-0.55, -0.05, -0.35]} color="#0891b2" opacity={0.18} roughness={0.7} description="Anteromedial: ureter/uterosacral ligament. Posterolateral: internal iliac artery. Medial: rectum. Lateral: pelvic sidewall vessels." clinicalSignificance="Developed during radical hysterectomy to expose cardinal ligament and ureter for safe parametrial resection. Middle rectal artery crosses this space.">
        <boxGeometry args={[0.28, 0.45, 0.25]} />
      </Structure>
      <Structure name="Pararectal Space (R)" system="spaces" position={[0.55, -0.05, -0.35]} color="#0891b2" opacity={0.18} roughness={0.7} description="Right pararectal space.">
        <boxGeometry args={[0.28, 0.45, 0.25]} />
      </Structure>

      <Structure name="Paravesical Space (L)" system="spaces" position={[-0.6, -0.05, 0.6]} color="#06b6d4" opacity={0.18} roughness={0.7} description="Medial: bladder/obliterated umbilical artery. Lateral: obturator internus/external iliac vessels. Posterior: cardinal ligament." clinicalSignificance="Developed during radical hysterectomy and pelvic lymphadenectomy. Contains obturator neurovascular bundle. Obliterated umbilical artery is the key landmark.">
        <boxGeometry args={[0.28, 0.45, 0.25]} />
      </Structure>
      <Structure name="Paravesical Space (R)" system="spaces" position={[0.6, -0.05, 0.6]} color="#06b6d4" opacity={0.18} roughness={0.7} description="Right paravesical space.">
        <boxGeometry args={[0.28, 0.45, 0.25]} />
      </Structure>

      <Structure name="Presacral Space" system="spaces" position={[0, 0.35, -0.95]} color="#0284c7" opacity={0.18} roughness={0.7} description="Between mesorectal fascia and presacral fascia/sacrum. Contains presacral venous plexus, median sacral vessels, presacral nodes, superior hypogastric plexus." clinicalSignificance="Presacral hemorrhage is LIFE-THREATENING — veins retract into sacral foramina. Accessed for sacrocolpopexy, presacral neurectomy, rectal mobilization. Waldeyer's fascia marks its inferior boundary.">
        <boxGeometry args={[0.65, 0.55, 0.12]} />
      </Structure>

      <Structure name="Ischioanal Fossa (L)" system="spaces" position={[-0.55, -0.85, -0.1]} color="#0369a1" opacity={0.18} roughness={0.7} description="Wedge-shaped perineal space. Medial: levator ani/external anal sphincter. Lateral: ischial tuberosity/obturator internus. Contains Alcock's canal with pudendal neurovascular bundle." clinicalSignificance="Site of ischiorectal abscesses. Pudendal nerve block performed transvaginally targeting the ischial spine. Fat pad allows distension during defecation and parturition.">
        <coneGeometry args={[0.25, 0.5, 8]} />
      </Structure>
      <Structure name="Ischioanal Fossa (R)" system="spaces" position={[0.55, -0.85, -0.1]} color="#0369a1" opacity={0.18} roughness={0.7} description="Right ischioanal fossa.">
        <coneGeometry args={[0.25, 0.5, 8]} />
      </Structure>

      <Structure name="Vesicouterine Pouch" system="spaces" position={[0, 0.1, 0.5]} color="#38bdf8" opacity={0.18} roughness={0.7} description="Between posterior bladder and anterior uterine body (isthmus). Shallower than Pouch of Douglas." clinicalSignificance="Site of peritoneal incision during cesarean section (vesicouterine fold incised to reflect bladder). Vesicouterine fistula (Youssef syndrome) occurs here.">
        <sphereGeometry args={[0.15, 12, 12]} />
      </Structure>

      <Structure name="Obturator Space" system="spaces" position={[-0.75, -0.1, 0.55]} color="#0ea5e9" opacity={0.18} roughness={0.7} description="Within the obturator fossa. Contains obturator nerve, artery, vein, obturator lymph nodes." clinicalSignificance="Site of obturator lymphadenectomy — most common procedure in gynecologic oncology staging. Obturator nerve must be identified and preserved.">
        <boxGeometry args={[0.22, 0.35, 0.2]} />
      </Structure>
    </SystemGroup>
  );
}
