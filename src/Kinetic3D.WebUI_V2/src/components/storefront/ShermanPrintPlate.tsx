"use client";

import { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group, Mesh } from "three";

export type FilamentTheme = "tactical" | "cyber" | "desert" | "prototype" | "matrix";

export const FILAMENT_PRESETS: Record<
  FilamentTheme,
  {
    name: string;
    description: string;
    badgeColor: string;
    hull: string;
    turret: string;
    tracks: string;
    wheels: string;
    accent: string;
  }
> = {
  tactical: {
    name: "Tactical Olive (Bảo Mật Quân Sự)",
    description: "Xanh ô-liu mờ quân sự cổ điển phối xích xám nòng súng cao cấp.",
    badgeColor: "#4d7c0f",
    hull: "#222a23",
    turret: "#2e3b2f",
    tracks: "#181a1c",
    wheels: "#2c332d",
    accent: "#f5b942",
  },
  cyber: {
    name: "Kinetic Cyber (Dark Carbon)",
    description: "Hợp kim carbon siêu bền đen bóng kết hợp điểm nhấn màu hổ phách đặc trưng.",
    badgeColor: "#f5b942",
    hull: "#15161a",
    turret: "#1f2228",
    tracks: "#0e0f12",
    wheels: "#22262d",
    accent: "#f5b942",
  },
  desert: {
    name: "Desert Storm (Cát Sa Mạc)",
    description: "Sơn sa mạc mờ chống bám bụi bão táp kết hợp chi tiết kim khí ngả vàng.",
    badgeColor: "#d97706",
    hull: "#6b583f",
    turret: "#786448",
    tracks: "#272522",
    wheels: "#594935",
    accent: "#fbbf24",
  },
  prototype: {
    name: "Raw Resin Prototype (Bản Mẫu SLA)",
    description: "Nhựa resin trắng mờ kỹ thuật, tối ưu hiển thị đường nét lớp in và kiểm tra cơ khí.",
    badgeColor: "#38bdf8",
    hull: "#dbe4ee",
    turret: "#e8eff5",
    tracks: "#64748b",
    wheels: "#cbd5e1",
    accent: "#0ea5e9",
  },
  matrix: {
    name: "Neon Matrix (Cyberpunk Special)",
    description: "Phong cách tương lai với ánh huỳnh quang ngọc bích nổi bật trên nền đen mờ.",
    badgeColor: "#10b981",
    hull: "#111815",
    turret: "#18221e",
    tracks: "#0a0e0c",
    wheels: "#1e2e26",
    accent: "#10b981",
  },
};

interface ShermanModelProps {
  theme?: FilamentTheme;
  wireframe?: boolean;
  autoRotate?: boolean;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/* ─── 3D Model of Sherman M4A1 Print Plate ─── */
export function ShermanModel({
  theme = "tactical",
  wireframe = false,
  autoRotate = false,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: ShermanModelProps) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF("/models/sherman_print_plate.glb");

  const colors = FILAMENT_PRESETS[theme];

  // Clone scene so multiple viewers don't clash materials
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    return clone;
  }, [scene]);

  // Dynamically update materials whenever theme or wireframe changes
  useMemo(() => {
    clonedScene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        let color = colors.hull;
        let roughness = 0.45;
        let metalness = 0.25;

        if (mesh.name.includes("turret")) {
          color = colors.turret;
          roughness = 0.4;
          metalness = 0.3;
        } else if (mesh.name.includes("tracks")) {
          color = colors.tracks;
          roughness = 0.7;
          metalness = 0.55;
        } else if (mesh.name.includes("wheels")) {
          color = colors.wheels;
          roughness = 0.5;
          metalness = 0.35;
        } else if (mesh.name.includes("accent")) {
          color = colors.accent;
          roughness = 0.3;
          metalness = 0.5;
        }

        mesh.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          roughness,
          metalness,
          wireframe,
        });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [clonedScene, colors, wireframe]);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Pre-load asset for instant rendering
useGLTF.preload("/models/sherman_print_plate.glb");

/* ─── Futuristic 3D Print Bed Plate ─── */
export function PrintBedPlate({ width = 4.4, depth = 3.2 }: { width?: number; depth?: number }) {
  return (
    <group position={[0, -0.04, 0]}>
      {/* Textured Dark PEI Bed */}
      <mesh receiveShadow position={[0, -0.015, 0]}>
        <boxGeometry args={[width, 0.03, depth]} />
        <meshStandardMaterial
          color="#121316"
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* Plate Border Neon Glow */}
      <lineSegments position={[0, 0.005, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(width + 0.02, 0.03, depth + 0.02)]} />
        <lineBasicMaterial color="#f5b942" transparent opacity={0.4} />
      </lineSegments>

      {/* Precision Grid lines */}
      <gridHelper
        args={[width, 22, "#f5b942", "#272a30"]}
        position={[0, 0.002, 0]}
      />

      {/* Calibration Corner Dots */}
      <mesh position={[-width / 2 + 0.2, 0.003, -depth / 2 + 0.2]}>
        <circleGeometry args={[0.04, 16]} />
        <meshBasicMaterial color="#f5b942" />
      </mesh>
      <mesh position={[width / 2 - 0.2, 0.003, -depth / 2 + 0.2]}>
        <circleGeometry args={[0.04, 16]} />
        <meshBasicMaterial color="#f5b942" />
      </mesh>
      <mesh position={[-width / 2 + 0.2, 0.003, depth / 2 - 0.2]}>
        <circleGeometry args={[0.04, 16]} />
        <meshBasicMaterial color="#f5b942" />
      </mesh>
      <mesh position={[width / 2 - 0.2, 0.003, depth / 2 - 0.2]}>
        <circleGeometry args={[0.04, 16]} />
        <meshBasicMaterial color="#f5b942" />
      </mesh>
    </group>
  );
}
