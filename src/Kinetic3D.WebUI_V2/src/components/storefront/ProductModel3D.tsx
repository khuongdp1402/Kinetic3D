"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, PresentationControls, Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Procedural 3D previews per category — no .glb assets required, so the
 * product detail page always renders something instead of a broken image
 * while real scanned models aren't available yet.
 */

function Keycap({ color }: { color: string }) {
  const w = 0.55;
  const h = 0.55;
  const r = 0.12;
  const shape = new THREE.Shape();
  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h);
  shape.quadraticCurveTo(w, -h, w, -h + r);
  shape.lineTo(w, h - r);
  shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h);
  shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, -h + r);
  shape.quadraticCurveTo(-w, -h, -w + r, -h);

  return (
    <group rotation={[0.15, 0, 0]}>
      <mesh rotation={[-1.15, 0, 0]}>
        <extrudeGeometry args={[shape, { depth: 0.4, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 4 }]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.28, 0.05]} rotation={[-1.15, 0, 0]}>
        <circleGeometry args={[0.11, 24]} />
        <meshStandardMaterial color="#1c1917" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Chibi({ color }: { color: string }) {
  return (
    <group position={[0, -0.05, 0]}>
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.38, 0.52, 0.82, 32]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.08} />
      </mesh>
      <mesh position={[0, -0.44, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.09, 32]} />
        <meshStandardMaterial color="#2b2d36" roughness={0.4} />
      </mesh>
      <mesh position={[-0.17, 0.75, 0.44]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.3} />
      </mesh>
      <mesh position={[0.17, 0.75, 0.44]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.3} />
      </mesh>
    </group>
  );
}

function HeritageTower({ color }: { color: string }) {
  const tiers = [];
  let y = -0.55;
  for (let i = 0; i < 4; i++) {
    const rTop = 0.5 - i * 0.09;
    const rBot = 0.58 - i * 0.09;
    const bodyH = 0.22;
    tiers.push(
      <mesh key={`body-${i}`} position={[0, y, 0]}>
        <cylinderGeometry args={[rTop, rBot, bodyH, 8]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    );
    tiers.push(
      <mesh key={`eaves-${i}`} position={[0, y + bodyH / 2 + 0.02, 0]}>
        <cylinderGeometry args={[rBot + 0.14, rBot + 0.14, 0.04, 8]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    );
    y += bodyH + 0.08;
  }
  return (
    <group position={[0, -0.05, 0]}>
      {tiers}
      <mesh position={[0, y + 0.1, 0]}>
        <coneGeometry args={[0.08, 0.35, 8]} />
        <meshStandardMaterial color="#d9b479" roughness={0.4} />
      </mesh>
    </group>
  );
}

type Builder = "keycap" | "chibi" | "tower";

const BUILDERS: Record<Builder, (color: string) => React.ReactNode> = {
  keycap: (color) => <Keycap color={color} />,
  chibi: (color) => <Chibi color={color} />,
  tower: (color) => <HeritageTower color={color} />,
};

export function ProductModel3D({ builder, color }: { builder: Builder; color: string }) {
  return (
    <div className="w-full h-full" style={{ backgroundColor: "var(--c-bg-deep)" }}>
      <Canvas camera={{ position: [0, 0.25, 3.2], fov: 35 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2.5, 3, 2]} intensity={1.1} />
        <directionalLight position={[-2, 1, -1.5]} intensity={0.4} color="#f97316" />
        <PresentationControls
          global
          rotation={[0, 0.4, 0]}
          polar={[-Math.PI / 6, Math.PI / 6]}
          azimuth={[-Math.PI / 2, Math.PI / 2]}
        >
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
            {BUILDERS[builder](color)}
          </Float>
        </PresentationControls>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
