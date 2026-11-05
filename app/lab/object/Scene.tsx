"use client";

import { Environment, Lightformer, useEnvironment } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { darkMetal } from "@/scene/materials";
import { withImperfections } from "@/scene/materials/imperfections";
import bill from "./bill-100.jpg";

/**
 * Offline renders of small real objects, lit like the cradle (same HDRIs, same dark metal): the
 * nav's four balls, the ball in "moving", and the prizes on /work. Units are tenths of a metre
 * (1 = 100 mm) so real sizes read directly: a $100 note is 1.56 x 0.66, an AirPods case 0.50 wide.
 */

type Kind = "balls" | "ball" | "gold" | "bronze" | "cash" | "airpods";
const lin = (r: number, g: number, b: number) =>
  new THREE.Color().setRGB(r, g, b, THREE.LinearSRGBColorSpace);

// Measured metal reflectance (F0, linear sRGB) from physicallybased.info; bronze is a 90/10 copper-tin.
const METALS = {
  gold: { color: lin(1.0, 0.766, 0.336), roughness: 0.24 },
  bronze: { color: lin(0.74, 0.47, 0.3), roughness: 0.28 },
} as const;

function metal(kind: keyof typeof METALS, extra: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  return withImperfections(
    new THREE.MeshPhysicalMaterial({ metalness: 1, ...METALS[kind], ...extra }),
    0.035,
    0.04,
  );
}

function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, color = false) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  return t;
}

/** The medal's struck face as a height map: a laurel wreath and the place in the middle. */
function reliefMap(numeral: string) {
  return canvasTexture(1024, 1024, (g) => {
    g.fillStyle = "#000";
    g.fillRect(0, 0, 1024, 1024);
    g.filter = "blur(2px)";
    g.fillStyle = "#fff";
    for (const side of [-1, 1]) {
      for (let k = 0; k < 13; k++) {
        const a = Math.PI / 2 + side * (0.42 + k * 0.165);
        const r = 395;
        const x = 512 + Math.cos(a) * r;
        const y = 512 + Math.sin(a) * r;
        for (const off of [-1, 1]) {
          g.save();
          g.translate(x, y);
          g.rotate(a + (side * Math.PI) / 2 + off * 0.55 * side);
          g.beginPath();
          g.ellipse(off * 22, 0, 30, 11, 0, 0, Math.PI * 2);
          g.fill();
          g.restore();
        }
      }
    }
    g.lineWidth = 9;
    g.strokeStyle = "#fff";
    g.beginPath();
    g.arc(512, 512, 395, Math.PI / 2 + 0.3, Math.PI / 2 + 2.6);
    g.stroke();
    g.beginPath();
    g.arc(512, 512, 395, Math.PI / 2 - 2.6, Math.PI / 2 - 0.3);
    g.stroke();
    g.filter = "blur(4px)";
    g.font = "bold 600px Georgia, 'Times New Roman', serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(numeral, 512, 560);
  });
}

/** A grosgrain ribbon: deep red, a white stripe down the middle, fine ribs across. */
function ribbonMap() {
  return canvasTexture(
    256,
    1024,
    (g) => {
      g.fillStyle = "#8f1d2c";
      g.fillRect(0, 0, 256, 1024);
      g.fillStyle = "#f1ece4";
      g.fillRect(104, 0, 48, 1024);
      g.fillStyle = "#7a1624";
      g.fillRect(0, 0, 10, 1024);
      g.fillRect(246, 0, 10, 1024);
      for (let y = 0; y < 1024; y += 3) {
        g.fillStyle = `rgba(0,0,0,${0.06 + Math.random() * 0.05})`;
        g.fillRect(0, y, 256, 1);
      }
    },
    true,
  );
}

function Medal({ kind, numeral }: { kind: keyof typeof METALS; numeral: string }) {
  const { body, face, ribbon, ribbonGeo, lathe } = useMemo(() => {
    const profile = [
      [0, 0.05],
      [0.8, 0.05],
      [0.82, 0.062],
      [0.845, 0.08],
      [0.86, 0.086],
      [0.95, 0.086],
      [0.985, 0.074],
      [1, 0.05],
      [1, -0.05],
      [0.985, -0.074],
      [0.95, -0.086],
      [0, -0.086],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const lathe = new THREE.LatheGeometry(profile, 160).rotateX(Math.PI / 2);
    const relief = reliefMap(numeral);
    const ribbonGeo = new THREE.PlaneGeometry(0.46, 0.8, 1, 16);
    const pos = ribbonGeo.attributes.position!;
    // A soft curve across the strap, as cloth hangs.
    for (let i = 0; i < pos.count; i++) pos.setZ(i, -0.04 * Math.cos((pos.getX(i) / 0.46) * Math.PI));
    ribbonGeo.computeVertexNormals();
    return {
      lathe,
      ribbonGeo,
      body: metal(kind),
      face: metal(kind, { bumpMap: relief, bumpScale: 3.2 }),
      ribbon: new THREE.MeshPhysicalMaterial({
        map: ribbonMap(),
        roughness: 0.62,
        sheen: 1,
        sheenRoughness: 0.45,
        sheenColor: new THREE.Color("#ffffff").multiplyScalar(0.35),
        side: THREE.DoubleSide,
      }),
    };
  }, [kind, numeral]);
  return (
    <group rotation={[-0.12, -0.38, 0]}>
      <mesh geometry={lathe} material={body} />
      <mesh position={[0, 0, 0.0505]} material={face}>
        <circleGeometry args={[0.8, 160]} />
      </mesh>
      <mesh position={[0, 1.07, 0]} material={body}>
        <torusGeometry args={[0.1, 0.032, 24, 64]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          geometry={ribbonGeo}
          material={ribbon}
          position={[s * 0.16, 1.43, s * 0.03]}
          rotation={[0, 0, s * -0.4]}
        />
      ))}
    </group>
  );
}

function Cash() {
  const { notes, band } = useMemo(() => {
    const W = 1.56;
    const D = 0.66;
    const t = 0.0011;
    const N = 140;
    const paper = new THREE.MeshPhysicalMaterial({ color: "#d9dccd", roughness: 0.85 });
    const map = new THREE.TextureLoader().load(bill.src);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 16;
    const face = new THREE.MeshPhysicalMaterial({ map, roughness: 0.78 });
    const geo = new THREE.BoxGeometry(W, t, D);
    const rand = (k: number) => Math.sin(k * 127.1 + 311.7) * 0.5;
    const notes = Array.from({ length: N }, (_, i) => ({
      key: i,
      geo,
      position: [rand(i) * 0.012, i * t, rand(i + 50) * 0.01] as THREE.Vector3Tuple,
      rotationY: rand(i + 99) * 0.008,
      materials: i === N - 1 ? [paper, paper, face, paper, paper, paper] : paper,
    }));
    const band = {
      geo: new THREE.BoxGeometry(0.32, N * t + 0.004, D + 0.004),
      material: new THREE.MeshPhysicalMaterial({ color: "#c79a3e", roughness: 0.7 }),
      y: (N * t) / 2 - t / 2,
    };
    return { notes, band };
  }, []);
  return (
    <group rotation={[0, -0.9, 0]}>
      {notes.map((n) => (
        <mesh
          key={n.key}
          geometry={n.geo}
          material={n.materials}
          position={n.position}
          rotation={[0, n.rotationY, 0]}
        />
      ))}
      <mesh geometry={band.geo} material={band.material} position={[0.16, band.y, 0]} />
    </group>
  );
}

function AirPods() {
  const group = useRef<THREE.Group>(null);
  const lidMesh = useRef<THREE.Mesh>(null);
  const W = 0.501;
  const D = 0.212;
  const Hb = 0.29;
  const Hl = 0.172;
  const r = 0.1;
  const parts = useMemo(() => {
    const shell = () =>
      new THREE.MeshPhysicalMaterial({
        color: "#f4f4f1",
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
      });
    const base = shell();
    base.clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)];
    const lid = shell();
    const tray = new THREE.Shape();
    const tw = W / 2 - 0.008;
    const td = D / 2 - 0.008;
    const tr = r - 0.008;
    tray.moveTo(-tw + tr, -td);
    tray.lineTo(tw - tr, -td);
    tray.quadraticCurveTo(tw, -td, tw, -td + tr);
    tray.lineTo(tw, td - tr);
    tray.quadraticCurveTo(tw, td, tw - tr, td);
    tray.lineTo(-tw + tr, td);
    tray.quadraticCurveTo(-tw, td, -tw, td - tr);
    tray.lineTo(-tw, -td + tr);
    tray.quadraticCurveTo(-tw, -td, -tw + tr, -td);
    for (const x of [-0.115, 0.115]) {
      const hole = new THREE.Path();
      hole.absellipse(x, 0, 0.088, 0.075, 0, Math.PI * 2, true);
      tray.holes.push(hole);
    }
    return {
      baseGeo: new RoundedBoxGeometry(W, Hb * 2, D, 8, r),
      lidGeo: new RoundedBoxGeometry(W, Hl * 2, D, 8, r),
      trayGeo: new THREE.ShapeGeometry(tray, 48).rotateX(-Math.PI / 2),
      base,
      lid,
      inside: new THREE.MeshPhysicalMaterial({ color: "#e6e6e2", roughness: 0.55 }),
      well: new THREE.MeshBasicMaterial({ color: "#2a2a28" }),
      bud: new THREE.MeshPhysicalMaterial({
        color: "#f6f6f3",
        roughness: 0.16,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
      }),
      grille: new THREE.MeshPhysicalMaterial({ color: "#5d5d5a", roughness: 0.7 }),
    };
  }, []);

  // The lid keeps only its top half; its clipping plane moves with it.
  useLayoutEffect(() => {
    group.current!.updateMatrixWorld(true);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0).applyMatrix4(lidMesh.current!.matrixWorld);
    parts.lid.clippingPlanes = [plane];
  }, [parts]);

  return (
    <group ref={group} rotation={[0, 0.55, 0]}>
      <mesh geometry={parts.baseGeo} material={parts.base} />
      <mesh geometry={parts.trayGeo} material={parts.inside} position={[0, -0.006, 0]} />
      {[-0.115, 0.115].map((x) => (
        <group key={x}>
          <mesh position={[x, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} material={parts.well}>
            <circleGeometry args={[0.088, 48]} />
          </mesh>
          <group position={[x, 0.012, 0]} rotation={[0, 0, Math.sign(x) * -0.35]}>
            <mesh material={parts.bud} scale={[1, 0.82, 0.92]}>
              <sphereGeometry args={[0.082, 64, 48]} />
            </mesh>
          </group>
        </group>
      ))}
      <mesh position={[0, -Hb * 0.55, D / 2 + 0.0005]} material={parts.grille}>
        <circleGeometry args={[0.006, 24]} />
      </mesh>
      <group position={[0, 0, -D / 2]} rotation={[-1.85, 0, 0]}>
        <mesh ref={lidMesh} geometry={parts.lidGeo} material={parts.lid} position={[0, 0, D / 2]} />
      </group>
    </group>
  );
}

function Balls({ count }: { count: number }) {
  const material = useMemo(() => darkMetal(), []);
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} material={material} position={[(i - (count - 1) / 2) * 2.004, 0, 0]}>
          <sphereGeometry args={[1, 128, 96]} />
        </mesh>
      ))}
    </>
  );
}

/** Where each object is seen from (elevation, azimuth in radians) and how it is lit. */
const SHOTS: Record<Kind, { view: [number, number]; hdri?: string; bg?: string; margin: number }> = {
  balls: { view: [0, 0], hdri: "gallery_neutral", margin: 1.02 },
  ball: { view: [0, 0], hdri: "gallery_neutral", margin: 1.02 },
  gold: { view: [0.05, 0], margin: 1.06 },
  bronze: { view: [0.05, 0], margin: 1.06 },
  cash: { view: [0.75, 0], margin: 1.06 },
  airpods: { view: [0.42, 0], bg: "#9a9a97", margin: 1.06 },
};

/** The cradle's own gallery HDRI, with the cradle's key light from the upper left. */
function Gallery({ file }: { file: string }) {
  const env = useEnvironment({ files: `/hdri/${file}.hdr` });
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    scene.environment = env;
  }, [scene, env]);
  return <directionalLight position={[-3, 5, 6]} intensity={2.2} />;
}

/** A product-photo studio for the prizes: a big soft key upper left, a strip fill right, a top light, a rim behind. */
function Studio({ bg = "#3a3a38" }: { bg?: string }) {
  return (
    <Environment resolution={512} frames={1}>
      <color attach="background" args={[bg]} />
      <Lightformer form="rect" intensity={3} position={[0, 4, 9]} scale={[10, 5, 1]} target={[0, 0, 0]} />
      <Lightformer
        form="rect"
        intensity={4}
        color="#fff8ee"
        position={[-5, 5, 6]}
        scale={[7, 5, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer form="rect" intensity={1.6} position={[6, 1, 4]} scale={[2, 7, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={2} position={[0, 9, 0]} scale={[10, 10, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.4} position={[3, 3, -7]} scale={[6, 3, 1]} target={[0, 0, 0]} />
      <Lightformer
        form="rect"
        intensity={0.5}
        color="#efe9df"
        position={[0, -6, 3]}
        scale={[12, 4, 1]}
        target={[0, 0, 0]}
      />
    </Environment>
  );
}

/** Moves the camera back until every vertex sits inside the frame, with `margin` to spare. */
function Fit({
  view,
  margin,
  children,
}: {
  view: [number, number];
  margin: number;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  useLayoutEffect(() => {
    const g = group.current!;
    g.updateMatrixWorld(true);
    const points: THREE.Vector3[] = [];
    g.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const pos = mesh.geometry.attributes.position!;
      const planes = (mesh.material as THREE.Material).clippingPlanes ?? [];
      for (let i = 0; i < pos.count; i += 3) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
        if (planes.every((pl) => pl.distanceToPoint(v) >= 0)) points.push(v);
      }
    });
    const box = new THREE.Box3().setFromPoints(points);
    const center = box.getCenter(new THREE.Vector3());
    const [el, az] = view;
    const dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
    camera.aspect = size.width / size.height;
    const fits = (d: number) => {
      camera.position.copy(center).addScaledVector(dir, d);
      camera.lookAt(center);
      camera.updateMatrixWorld(true);
      camera.updateProjectionMatrix();
      const p = new THREE.Vector3();
      return points.every((v) => {
        p.copy(v).project(camera);
        return Math.abs(p.x) * margin <= 1 && Math.abs(p.y) * margin <= 1;
      });
    };
    let lo = 0.5;
    let hi = 200;
    for (let k = 0; k < 40; k++) {
      const mid = (lo + hi) / 2;
      if (fits(mid)) hi = mid;
      else lo = mid;
    }
    fits(hi);
    // Centre the drawing exactly: shift the view by the leftover offset of the projected box.
    const ndc = new THREE.Box3().setFromPoints(points.map((v) => v.clone().project(camera)));
    const c = ndc.getCenter(new THREE.Vector3());
    camera.setViewOffset(
      size.width,
      size.height,
      (c.x * size.width) / 2,
      (-c.y * size.height) / 2,
      size.width,
      size.height,
    );
  }, [camera, size, view, margin]);
  return <group ref={group}>{children}</group>;
}

function Ready() {
  const frames = useRef(0);
  useFrame(() => {
    if (++frames.current === 30) document.body.setAttribute("data-ready", "1");
  });
  return null;
}

export default function Scene() {
  const kind = (new URLSearchParams(location.search).get("o") ?? "gold") as Kind;
  const shot = SHOTS[kind];
  const object = {
    balls: <Balls count={4} />,
    ball: <Balls count={1} />,
    gold: <Medal kind="gold" numeral="1" />,
    bronze: <Medal kind="bronze" numeral="3" />,
    cash: <Cash />,
    airpods: <AirPods />,
  }[kind];
  return (
    <Canvas
      className="!absolute inset-0"
      gl={{ antialias: true, alpha: true, localClippingEnabled: true } as THREE.WebGLRendererParameters}
      dpr={2}
      camera={{ fov: 14, near: 0.05, far: 500 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.localClippingEnabled = true;
        gl.toneMapping = THREE.NeutralToneMapping;
      }}
    >
      <Suspense fallback={null}>
        {shot.hdri ? <Gallery file={shot.hdri} /> : <Studio bg={shot.bg} />}
        <Fit view={shot.view} margin={shot.margin}>
          {object}
        </Fit>
        <Ready />
      </Suspense>
    </Canvas>
  );
}
