"use client";

import { useState, useRef, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import {
  ImagePlus,
  Box,
  Wand2,
  Sparkles,
  Download,
  Layers,
  Cpu,
  Trash2,
  ChevronRight,
  Sun,
  Camera,
  Grid,
  HelpCircle,
  RotateCcw,
  Share2,
  Printer,
  Star,
  Zap,
  Sliders,
  Lock,
  Check,
  Info,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

/* ─── 3D Assets for Right Drawer ─── */
interface StudioAsset {
  id: string;
  name: string;
  thumbnail: string;
  faces: number;
  vertices: number;
  dimensions: string;
  printWeight: string;
  printTime: string;
  baseColor: string;
  modelUrl?: string;
  modelType: string;
}

const SAMPLE_ASSETS: StudioAsset[] = [
  {
    id: "damaged-helmet-3d",
    name: "Mũ Giáp Chiến Binh Cyberpunk (Battle Helmet)",
    thumbnail: "/images/products/cyber-helmet.png",
    faces: 1680500,
    vertices: 840250,
    dimensions: "11.0 x 11.0 x 13.0 cm",
    printWeight: "165g (SLA Resin 12K)",
    printTime: "7h 15m",
    baseColor: "#b45309",
    modelUrl: "/models/DamagedHelmet.glb",
    modelType: "helmet",
  },
  {
    id: "chronograph-watch-3d",
    name: "Đồng Hồ Cơ Khí Chronograph Thụy Sĩ (Luxury Watch)",
    thumbnail: "/images/products/watch-chronograph.jpg",
    faces: 1420000,
    vertices: 710000,
    dimensions: "4.5 x 4.5 x 1.4 cm",
    printWeight: "45g (Resin Tough Titanium)",
    printTime: "3h 10m",
    baseColor: "#3b82f6",
    modelUrl: "/models/ChronographWatch.glb",
    modelType: "watch",
  },
  {
    id: "car-concept-3d",
    name: "Siêu Xe Thể Thao Tương Lai (Concept One Supercar)",
    thumbnail: "/images/products/car-concept.jpg",
    faces: 1850000,
    vertices: 925000,
    dimensions: "19.0 x 8.5 x 5.0 cm",
    printWeight: "180g (High Gloss PLA)",
    printTime: "9h 10m",
    baseColor: "#dc2626",
    modelUrl: "/models/CarConcept.glb",
    modelType: "supercar",
  },
  {
    id: "sherman-tank-3d",
    name: "Xe Tăng Sherman M4A1 62 Chi Tiết (AMS Edition)",
    thumbnail: "/images/products/sherman-m4a1-plate.jpg",
    faces: 1964114,
    vertices: 982059,
    dimensions: "18.5 x 8.5 x 9.5 cm",
    printWeight: "280g (PLA+ Matte)",
    printTime: "14h 20m",
    baseColor: "#4d7c0f",
    modelUrl: "/models/sherman_print_plate.glb",
    modelType: "sherman",
  },
  {
    id: "retro-boombox-3d",
    name: "Đài Cassette Retro 1980s Cyber Boombox",
    thumbnail: "/images/products/boombox-retro.jpg",
    faces: 980000,
    vertices: 490000,
    dimensions: "16.0 x 6.5 x 10.5 cm",
    printWeight: "150g (PETG Tough)",
    printTime: "5h 40m",
    baseColor: "#eab308",
    modelUrl: "/models/BoomBox.glb",
    modelType: "boombox",
  },
  {
    id: "flexi-fox-3d",
    name: "Cáo Lửa Thần Thoại Low-Poly Khớp Động (Flexi Fox)",
    thumbnail: "/images/products/fox-figurine.jpg",
    faces: 420000,
    vertices: 210000,
    dimensions: "12.0 x 6.0 x 8.5 cm",
    printWeight: "65g (PLA Silk Gradient)",
    printTime: "3h 05m",
    baseColor: "#f97316",
    modelUrl: "/models/Fox.glb",
    modelType: "fox",
  },
  {
    id: "vintage-lantern-3d",
    name: "Đèn Lồng Bão Retro Kim Loại (Vintage Lantern)",
    thumbnail: "/images/products/lantern-retro.jpg",
    faces: 1150000,
    vertices: 575000,
    dimensions: "10.0 x 10.0 x 18.0 cm",
    printWeight: "175g (Metallic PLA)",
    printTime: "6h 50m",
    baseColor: "#ca8a04",
    modelUrl: "/models/Lantern.glb",
    modelType: "lantern",
  },
  {
    id: "cyber-sunglasses-3d",
    name: "Kính Mát Thời Trang Cyberpunk Khronos",
    thumbnail: "/images/products/sunglasses-khronos.jpg",
    faces: 580000,
    vertices: 290000,
    dimensions: "14.5 x 14.0 x 4.2 cm",
    printWeight: "35g (PETG Carbon)",
    printTime: "2h 15m",
    baseColor: "#06b6d4",
    modelUrl: "/models/SunglassesKhronos.glb",
    modelType: "sunglasses",
  },
  {
    id: "modular-toy-car-3d",
    name: "Xe Đua Đồ Chơi Khớp Lắp Ráp Cơ Học (Toy Car)",
    thumbnail: "/images/products/toy-car.jpg",
    faces: 890000,
    vertices: 445000,
    dimensions: "11.0 x 6.0 x 4.5 cm",
    printWeight: "85g (PLA Tough)",
    printTime: "3h 45m",
    baseColor: "#22c55e",
    modelUrl: "/models/ToyCar.glb",
    modelType: "toycar",
  },
  {
    id: "flexi-dragon-3d",
    name: "Rồng Thần Thoại Khớp Động (Flexi Dragon)",
    thumbnail: "/images/products/dragon-sculpture.jpg",
    faces: 1820000,
    vertices: 910000,
    dimensions: "35.0 x 8.5 x 6.5 cm",
    printWeight: "165g (PLA Silk)",
    printTime: "7h 15m",
    baseColor: "#10b981",
    modelUrl: "/models/DragonAttenuation.glb",
    modelType: "dragon",
  },
  {
    id: "tactical-water-bottle-3d",
    name: "Bình Nước Thể Thao Tối Giản (Water Bottle)",
    thumbnail: "/images/products/water-bottle.jpg",
    faces: 760000,
    vertices: 380000,
    dimensions: "7.5 x 7.5 x 22.0 cm",
    printWeight: "120g (PETG Food-Grade)",
    printTime: "4h 30m",
    baseColor: "#3b82f6",
    modelUrl: "/models/WaterBottle.glb",
    modelType: "bottle",
  },
  {
    id: "antique-camera-3d",
    name: "Máy Ảnh Cổ Điển Bellows Steampunk (Camera)",
    thumbnail: "/images/products/antique-camera.jpg",
    faces: 1350000,
    vertices: 675000,
    dimensions: "12.0 x 10.5 x 11.0 cm",
    printWeight: "140g (PLA Wood & Brass)",
    printTime: "5h 20m",
    baseColor: "#92400e",
    modelUrl: "/models/AntiqueCamera.glb",
    modelType: "camera",
  },
  {
    id: "yellow-duck-3d",
    name: "Vịt Vàng Đồ Chơi Khớp Mảnh In 3D (Duck)",
    thumbnail: "/images/products/duck-yellow.png",
    faces: 340000,
    vertices: 170000,
    dimensions: "7.0 x 6.5 x 6.5 cm",
    printWeight: "40g (PLA Silk Gold)",
    printTime: "1h 50m",
    baseColor: "#eab308",
    modelUrl: "/models/Duck.glb",
    modelType: "duck",
  },
  {
    id: "nefertiti-bust-3d",
    name: "Tượng Điêu Khắc Nữ Hoàng Nefertiti",
    thumbnail: "/images/products/nefertiti-bust-print.jpg",
    faces: 2150000,
    vertices: 1075000,
    dimensions: "8.0 x 9.5 x 16.5 cm",
    printWeight: "210g (Stone Composite)",
    printTime: "5h 40m",
    baseColor: "#ca8a04",
    modelUrl: "/models/Nefertiti.glb",
    modelType: "nefertiti",
  },
  {
    id: "planetary-gearbox-3d",
    name: "Hộp Bánh Răng Hành Tinh Vô Tận (Gearbox)",
    thumbnail: "/images/products/gearbox-assy-print.jpg",
    faces: 980000,
    vertices: 490000,
    dimensions: "9.0 x 9.0 x 4.5 cm",
    printWeight: "95g (PETG Tough)",
    printTime: "4h 45m",
    baseColor: "#ea580c",
    modelUrl: "/models/GearboxAssy.glb",
    modelType: "gearbox",
  },
  {
    id: "primary-ion-drive-3d",
    name: "Động Cơ Đẩy Primary Ion Drive",
    thumbnail: "/images/products/primary-ion-drive-print.jpg",
    faces: 1450800,
    vertices: 725400,
    dimensions: "14.0 x 12.0 x 16.0 cm",
    printWeight: "190g (PLA Metallic)",
    printTime: "8h 30m",
    baseColor: "#0284c7",
    modelUrl: "/models/PrimaryIonDrive.glb",
    modelType: "ion-drive",
  },
  {
    id: "cyber-robot-3d",
    name: "Robot Trợ Lý Biểu Cảm (Expressive Bot)",
    thumbnail: "/images/products/robot-expressive-print.jpg",
    faces: 460000,
    vertices: 230000,
    dimensions: "9.0 x 8.0 x 13.5 cm",
    printWeight: "90g (PLA Tough)",
    printTime: "3h 50m",
    baseColor: "#facc15",
    modelUrl: "/models/RobotExpressive.glb",
    modelType: "robot",
  },
];

/* ─── Procedural Point Cloud Particle Simulation (Exact Tripo3D Morphing Effect) ─── */
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function PointCloudParticleField({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const count = 4500;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const u = pseudoRandom(i * 3 + 1);
      const v = pseudoRandom(i * 3 + 2);
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(pseudoRandom(i * 3 + 3)) * 2.2;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.y = t * 0.35;
    pointsRef.current.rotation.x = Math.sin(t * 0.2) * 0.15;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={progress > 70 ? "#f5b942" : "#ffffff"}
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Real GLB Model Loader with Automatic Bounding Box Normalization ─── */
function RealGLTFModel({
  url,
  materialPreset,
  showGrid,
}: {
  url: string;
  materialPreset: "clay" | "iridescent" | "color" | "wireframe";
  color: string;
  showGrid: boolean;
}) {
  const { scene } = useGLTF(url);
  const { group, bottomY } = useMemo(() => {
    const clone = scene.clone(true);

    const clayMat = new THREE.MeshStandardMaterial({
      color: "#e5e7eb",
      roughness: 0.85,
      metalness: 0.1,
    });
    const wireMat = new THREE.MeshStandardMaterial({
      color: "#f5b942",
      wireframe: true,
      roughness: 0.5,
    });
    const iriMat = new THREE.MeshStandardMaterial({
      color: "#c084fc",
      roughness: 0.2,
      metalness: 0.8,
      emissive: "#4c1d95",
      emissiveIntensity: 0.15,
    });

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.castShadow = true;
        m.receiveShadow = true;
        if (materialPreset === "clay") {
          m.material = clayMat;
        } else if (materialPreset === "wireframe") {
          m.material = wireMat;
        } else if (materialPreset === "iridescent") {
          m.material = iriMat;
        }
      }
    });

    // Compute bounding box and normalize scale to uniform 2.4 units
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    const targetSize = 2.4;
    const scale = maxDim > 0 ? targetSize / maxDim : 1;

    // Center model precisely at origin (0, 0, 0)
    clone.scale.setScalar(scale);
    clone.position.x = -center.x * scale;
    clone.position.y = -center.y * scale;
    clone.position.z = -center.z * scale;

    const grp = new THREE.Group();
    grp.add(clone);

    const bY = -(size.y * scale) / 2;
    return { group: grp, bottomY: bY };
  }, [scene, materialPreset]);

  return (
    <>
      <primitive object={group} />

      {/* Ground contact shadow */}
      <ContactShadows
        position={[0, bottomY, 0]}
        opacity={0.65}
        scale={7}
        blur={2}
        far={3}
        color="#000000"
      />

      {/* Studio circular base pedestal (Tripo3D style) */}
      <mesh position={[0, bottomY - 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[1.7, 1.8, 0.08, 48]} />
        <meshStandardMaterial color="#1a1b24" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Print bed grid if enabled */}
      {showGrid && (
        <gridHelper
          args={[6, 24, "#f5b942", "#27272a"]}
          position={[0, bottomY - 0.005, 0]}
        />
      )}
    </>
  );
}

/* ─── High-Detail Sculpted 3D Model Renderer ─── */
function HighDetailSculptModel({
  color,
  materialPreset,
  showGrid,
}: {
  color: string;
  materialPreset: "clay" | "iridescent" | "color" | "wireframe";
  showGrid: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.12;
  });

  const materialProps = useMemo(() => {
    if (materialPreset === "wireframe") {
      return { wireframe: true, color: "#f5b942", emissive: "#f5b942", emissiveIntensity: 0.2 };
    }
    if (materialPreset === "clay") {
      return { color: "#e5e7eb", roughness: 0.85, metalness: 0.1 };
    }
    if (materialPreset === "iridescent") {
      return { color: "#c084fc", roughness: 0.2, metalness: 0.8, emissive: "#4c1d95", emissiveIntensity: 0.15 };
    }
    return { color: color, roughness: 0.4, metalness: 0.3 };
  }, [materialPreset, color]);

  const bottomY = -1.25;

  return (
    <>
      <group ref={groupRef} position={[0, -0.2, 0]}>
        {/* Torso / Body Sculpt */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.25, 4]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>

        {/* Head / Feature Sculpt */}
        <mesh position={[0, 1.7, 0.2]} castShadow receiveShadow>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.85, 2.7, -0.2]} rotation={[0.2, -0.3, -0.6]}>
          <coneGeometry args={[0.35, 1.6, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[0.85, 2.7, -0.2]} rotation={[0.2, 0.3, 0.6]}>
          <coneGeometry args={[0.35, 1.6, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>

        {/* Fluffy Collar */}
        <mesh position={[0, 1.0, 0.1]}>
          <torusGeometry args={[1.0, 0.45, 16, 32]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>

        {/* Tail */}
        <mesh position={[0, 0.5, -1.3]} rotation={[-0.8, 0, 0]}>
          <coneGeometry args={[0.65, 1.8, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.6, -0.7, 0.6]}>
          <cylinderGeometry args={[0.22, 0.28, 1.0, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[0.6, -0.7, 0.6]}>
          <cylinderGeometry args={[0.22, 0.28, 1.0, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[-0.6, -0.7, -0.6]}>
          <cylinderGeometry args={[0.22, 0.28, 1.0, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[0.6, -0.7, -0.6]}>
          <cylinderGeometry args={[0.22, 0.28, 1.0, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>

        {/* Circular Studio Base */}
        <mesh position={[0, -1.25, 0]}>
          <cylinderGeometry args={[1.9, 2.0, 0.15, 48]} />
          <meshStandardMaterial color="#1e1e28" roughness={0.7} metalness={0.4} />
        </mesh>
      </group>

      <ContactShadows
        position={[0, bottomY, 0]}
        opacity={0.65}
        scale={7}
        blur={2}
        far={3}
        color="#000000"
      />

      {showGrid && (
        <gridHelper
          args={[6, 24, "#f59e0b", "#27272a"]}
          position={[0, bottomY - 0.005, 0]}
        />
      )}
    </>
  );
}

export default function TripoStudioCustomPage() {
  const [assetsList, setAssetsList] = useState<StudioAsset[]>(SAMPLE_ASSETS);
  const [activeAsset, setActiveAsset] = useState<StudioAsset>(SAMPLE_ASSETS[0]);
  const [referenceImg, setReferenceImg] = useState<string>(SAMPLE_ASSETS[0].thumbnail);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genProgress, setGenProgress] = useState<number>(0);
  const [genTip, setGenTip] = useState<string>("Initializing GPU Tensor Cores...");
  const [modelMode, setModelMode] = useState<"hd" | "smart">("hd");
  const [materialPreset, setMaterialPreset] = useState<"clay" | "iridescent" | "color" | "wireframe">("color");
  const [activeColor, setActiveColor] = useState<string>(SAMPLE_ASSETS[0].baseColor);
  const [rightTab, setRightTab] = useState<"assets" | "property">("assets");
  const [partsToggle, setPartsToggle] = useState<boolean>(true);
  const [texture8k, setTexture8k] = useState<boolean>(false);
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const studioControlsRef = useRef<React.ElementRef<typeof OrbitControls>>(null);
  const addItem = useCartStore((s) => s.addItem);

  const handleResetStudioCamera = () => {
    if (studioControlsRef.current) {
      studioControlsRef.current.target.set(0, 0, 0);
      studioControlsRef.current.object.position.set(2.6, 1.6, 3.4);
      studioControlsRef.current.update();
    }
  };

  // Lock window scroll so custom 3D studio stays pinned to 100vh without scrolling down
  useEffect(() => {
    const origHtml = document.documentElement.style.overflow;
    const origBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = origHtml;
      document.body.style.overflow = origBody;
    };
  }, []);

  // Trigger AI 3D generation via /api/ai-3d/generate
  const handleStartGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenProgress(10);
    setGenTip("Đang gửi yêu cầu & khởi tạo GPU Tensor Cores...");

    try {
      const savedKey = typeof window !== "undefined" ? localStorage.getItem("kinetic3d_ai_key") || "" : "";
      const res = await fetch("/api/ai-3d/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: activeAsset.name || "Cyberpunk mecha high-precision 3d print model",
          provider: "tripo",
          apiKey: savedKey || undefined,
        }),
      });

      const data = await res.json();
      const taskId = data.taskId;

      let curr = 25;
      setGenProgress(curr);
      setGenTip("Xây dựng khung lưới đa giác Quad-Mesh topo...");

      const timer = setInterval(async () => {
        try {
          const checkRes = await fetch(`/api/ai-3d/task/${taskId}?provider=tripo`);
          const checkData = await checkRes.json();

          if (checkData.success && (checkData.status === "success" || checkData.progress >= 100)) {
            clearInterval(timer);
            setGenProgress(100);
            setGenTip("Hoàn tất! Đang nạp mô hình 3D vào khung vẽ...");

            const newModelUrl = checkData.modelUrl || activeAsset.modelUrl;
            const newAsset: StudioAsset = {
              id: `studio-gen-${Date.now()}`,
              name: checkData.item?.name || `Mẫu In AI: ${activeAsset.name}`,
              thumbnail: checkData.imageUrl || activeAsset.thumbnail,
              faces: checkData.item?.faces || 1640000,
              vertices: checkData.item?.vertices || 820000,
              dimensions: "14.0 x 12.0 x 16.0 cm",
              printWeight: checkData.item?.printWeight || "185g",
              printTime: checkData.item?.printTime || "6h 45m",
              baseColor: activeColor,
              modelUrl: newModelUrl,
              modelType: "ai-generated",
            };

            setAssetsList((prev) => [newAsset, ...prev]);
            setActiveAsset(newAsset);

            setTimeout(() => {
              setIsGenerating(false);
              setGenProgress(0);
            }, 600);
          } else {
            curr = Math.min(94, curr + 16);
            setGenProgress(curr);
            if (curr > 45 && curr < 75) {
              setGenTip("Tổng hợp vật liệu PBR Albedo, Độ nhám & Kim loại 8K...");
            } else if (curr >= 75) {
              setGenTip("Tối ưu hình học kín nước (Watertight Manifold) cho máy in 3D...");
            }
          }
        } catch (pollErr) {
          console.error("Polling error in studio:", pollErr);
        }
      }, 1000);
    } catch (err: unknown) {
      console.error("Generate error:", err);
      // Fallback gracefully to simulated progress
      let p = 30;
      const fallbackTimer = setInterval(() => {
        p += 20;
        setGenProgress(Math.min(100, p));
        if (p >= 100) {
          clearInterval(fallbackTimer);
          setTimeout(() => {
            setIsGenerating(false);
            setGenProgress(0);
          }, 500);
        }
      }, 400);
    }
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setReferenceImg(url);
    }
  };

  const handleSendToFabrication = () => {
    addItem({
      id: `custom-ai-${activeAsset.id}-${Date.now()}`,
      productId: activeAsset.id,
      name: `[Studio 3D] ${activeAsset.name}`,
      price: 450000,
      quantity: 1,
      customText: "In từ bản dựng 3D Kinetic Studio",
      variants: {
        color: activeColor,
        size: "Tiêu chuẩn (15cm)",
      },
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <div
      className="w-full h-screen overflow-hidden flex flex-col pt-16 select-none"
      style={{ backgroundColor: "#0b0c10", color: "#ffffff" }}
    >
      {/* ── 1. Top Application Bar ── */}
      <header
        className="h-12 border-b border-white/10 px-4 flex items-center justify-between shrink-0 z-30"
        style={{ backgroundColor: "#111218" }}
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#f5b942] text-black font-black text-xs flex items-center justify-center font-mono">
              3D
            </span>
            <span className="font-bold text-sm tracking-tight text-white">Kinetic Studio</span>
          </Link>
          <span className="text-white/20">|</span>
          <nav className="hidden lg:flex items-center gap-4 text-xs text-white/60">
            <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
            <span className="text-white font-semibold">Kho mẫu in</span>
            <Link href="/products" className="hover:text-white transition-colors">Cửa hàng</Link>
            <Link href="/categories" className="hover:text-white transition-colors">Danh mục</Link>
          </nav>
        </div>

        {/* Center Banner */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5b942]/10 border border-[#f5b942]/30 text-[11px] text-[#f5b942]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mới: Hệ thống Smart Mesh P2.0 giải mã đa giác Quads và tối ưu file in 3D chuẩn xác &gt;</span>
        </div>

        {/* Right User & Credit Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
            <span className="text-white/40">Đồng bộ DCC</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
            <span className="text-amber-400">🟡</span>
            <span className="text-white/90 font-bold">170 Credits</span>
          </div>
          <button
            onClick={() => alert("Đã mở gói nâng cấp thành viên Kinetic Studio Pro")}
            className="px-3 py-1 rounded-full text-xs font-bold bg-[#f5b942] text-black hover:opacity-90 transition-opacity"
          >
            Nâng cấp Pro
          </button>
        </div>
      </header>

      {/* ── 2. Main Studio Body (3 Columns) ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ── Col 1: Left Vertical Tool Rail + Settings Panel ── */}
        <aside
          className="w-[340px] md:w-[380px] h-full min-h-0 border-r border-white/10 flex shrink-0 z-20 overflow-hidden"
          style={{ backgroundColor: "#111218" }}
          data-lenis-prevent="true"
        >
          {/* Far Left Icon Rail */}
          <div className="w-14 h-full border-r border-white/10 flex flex-col items-center py-4 gap-5 shrink-0 bg-[#0d0e14]">
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-[#a855f7]/20 border border-[#a855f7]/50 text-[#c084fc]"
              title="Chuyển ảnh sang mô hình 3D (Image-to-3D)"
            >
              <ImagePlus className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              title="Bộ khởi tạo mô hình 3D AI"
            >
              <Wand2 className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              title="Tách chi tiết in rời (Segment Parts)"
            >
              <Box className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              title="Tái cấu trúc lưới Quad (Retopology)"
            >
              <Cpu className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              title="Vật liệu PBR 8K siêu nét"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          {/* Secondary Control Panel */}
          <div
            className="flex-1 min-h-0 flex flex-col p-4 overflow-y-auto custom-scrollbar justify-between"
            data-lenis-prevent="true"
            style={{ overscrollBehavior: "contain" }}
          >
            <div className="space-y-4">
              {/* Generate Model Header */}
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#f5b942]" />
                <span className="text-xs font-bold text-white tracking-wide">Khởi Tạo Mô Hình 3D</span>
              </div>

              {/* Mode Toggle */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
                <button
                  onClick={() => setModelMode("hd")}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    modelMode === "hd"
                      ? "bg-white text-black shadow-md"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Mô hình HD
                </button>
                <button
                  onClick={() => setModelMode("smart")}
                  className={`py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                    modelMode === "smart"
                      ? "bg-white text-black shadow-md"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <span>Lưới Quads</span>
                  <span className="text-[10px] text-amber-400">✨</span>
                </button>
              </div>

              {/* Upload / Reference Box (Thumbnail from Tripo3D screenshot) */}
              <div className="rounded-2xl border border-white/15 bg-black/50 p-3 space-y-3">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg bg-white/10 text-white">🖼</button>
                    <button className="p-1.5 rounded-lg text-white/40 hover:text-white">🎲</button>
                    <button className="p-1.5 rounded-lg text-white/40 hover:text-white">✏️</button>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-[#f5b942] hover:underline"
                  >
                    Đổi ảnh tham chiếu
                  </button>
                </div>

                <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-white/10 bg-[#181922] p-2 flex items-center justify-center group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={referenceImg}
                    alt="Reference Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setReferenceImg(SAMPLE_ASSETS[0].thumbnail)}
                      className="w-7 h-7 rounded-lg bg-black/80 border border-white/20 flex items-center justify-center text-red-400 hover:text-red-300"
                      title="Xóa ảnh"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => alert("Chế độ Multi-Views đã tạo 4 góc chụp chuẩn: Trước, Sau, Trái, Phải")}
                    className="absolute bottom-3 left-3 right-3 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90 hover:bg-black flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tạo 4 góc nhìn chuẩn</span>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadImage}
                />
              </div>

              {/* General Settings */}
              <div className="space-y-3 pt-1">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/[0.04]">
                  <span className="text-xs text-white/80">Cấu hình hình học & Vật liệu PBR</span>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </div>

                {/* Members Only Section */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold">
                    <span>👑 Tính năng Pro</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/70">
                    <div className="flex items-center gap-1.5">
                      <span>Tạo mẫu chi tiết in rời</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">Dùng thử</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={partsToggle}
                      onChange={(e) => setPartsToggle(e.target.checked)}
                      className="w-4 h-4 accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/70">
                    <div className="flex items-center gap-1.5">
                      <span>Vật liệu PBR 8K siêu nét</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">Dùng thử</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={texture8k}
                      onChange={(e) => setTexture8k(e.target.checked)}
                      className="w-4 h-4 accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span>Quyền riêng tư</span>
                    <button
                      type="button"
                      onClick={() => setPrivacy(privacy === "public" ? "private" : "public")}
                      className="text-xs text-white/90 font-mono hover:text-[#f5b942] transition-colors cursor-pointer"
                    >
                      {privacy === "public" ? "🌐 Công khai" : "🔒 Riêng tư"}
                    </button>
                  </div>
                </div>

                {/* AI Model Version Selector */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                    Phiên bản AI
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">v3.1 — Độ nét tối đa</span>
                    <span className="text-[10px] text-white/40">Mặc định</span>
                  </div>
                  <span className="text-[10px] text-white/40 block mt-0.5">Tối ưu hoá tính toán cho độ chính xác cơ học cao</span>
                </div>
              </div>
            </div>

            {/* Bottom Generate CTA */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={handleStartGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_25px_rgba(245,185,66,0.3)] disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: "#f5b942", color: "#0a0a0f" }}
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin text-lg">⚙</span>
                    <span>Đang tạo mẫu 3D... ({genProgress}%)</span>
                  </>
                ) : (
                  <>
                    <span>Khởi Tạo 3D</span>
                    <span className="text-amber-950 font-black">🟡 30 Credits</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* ── Col 2: Center 3D Stage Viewport ── */}
        <main className="flex-1 relative overflow-hidden flex flex-col bg-[#14151d]">
          {/* Top-Right Topology & Vertices Counter (Matching Screenshot exactly) */}
          <div className="absolute top-4 right-14 z-20 flex items-center gap-6 font-mono text-xs text-white/70 pointer-events-none bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <div>
              <span className="text-white/40 block text-[10px]">Cấu trúc</span>
              <span className="font-bold text-white">Lưới tam giác</span>
            </div>
            <div>
              <span className="text-white/40 block text-[10px]">Mặt lưới (Faces)</span>
              <span className="font-bold text-white">{activeAsset.faces.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[10px]">Đỉnh (Vertices)</span>
              <span className="font-bold text-white">{activeAsset.vertices.toLocaleString()}</span>
            </div>
          </div>

          {/* Right vertical floating tool icons (Matching Screenshot column) */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 p-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white/70">
            {/* 3D Orientation Gizmo Cube */}
            <div className="w-8 h-8 rounded-lg bg-black/80 flex items-center justify-center font-bold text-[10px] text-cyan-400 border border-white/10">
              Y/Z
            </div>
            <button
              onClick={() => setMaterialPreset(materialPreset === "clay" ? "color" : "clay")}
              className={`w-8 h-8 rounded-lg flex items-center justify-center hover:text-white hover:bg-white/10 transition-colors ${
                materialPreset === "clay" ? "text-amber-400" : ""
              }`}
              title="Đổi nguồn sáng / Chế độ Clay"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:text-white hover:bg-white/10 transition-colors"
              title="Chụp ảnh render"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center hover:text-white hover:bg-white/10 transition-colors ${
                showGrid ? "text-[#f5b942]" : ""
              }`}
              title="Lưới bàn in"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:text-white hover:bg-white/10 transition-colors"
              title="Trợ giúp"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetStudioCamera}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:text-white hover:bg-white/10 transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* 3D Canvas / Generating Simulation */}
          <div className="w-full h-full relative">
            {isGenerating ? (
              /* Generating State: Exact Tripo3D Point Cloud Dispersion Morphing */
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                  <ambientLight intensity={0.5} />
                  <PointCloudParticleField progress={genProgress} />
                </Canvas>

                {/* Status indicator pill in screenshot */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
                  <div className="px-6 py-2.5 rounded-full bg-black/80 backdrop-blur-md border border-[#f5b942]/40 shadow-[0_0_25px_rgba(245,185,66,0.3)] flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#f5b942] border-t-transparent animate-spin" />
                    <span className="text-sm font-bold text-white font-mono">
                      Generating... {genProgress}%
                    </span>
                  </div>
                  <span className="text-xs text-white/50 font-mono text-center max-w-md">
                    {genTip}
                  </span>
                </div>
              </div>
            ) : (
              /* Ready State: Full 3D Interactive Stage */
              <Canvas
                camera={{ position: [2.6, 1.6, 3.4], fov: 42 }}
                gl={{ preserveDrawingBuffer: true, antialias: true }}
              >
                <ambientLight intensity={1.1} />
                <directionalLight
                  position={[5, 8, 5]}
                  intensity={1.8}
                  castShadow
                  shadow-mapSize-width={1024}
                  shadow-mapSize-height={1024}
                />
                <directionalLight position={[-5, 4, -4]} intensity={0.6} color="#38bdf8" />
                <pointLight position={[4, -2, 4]} intensity={0.4} color="#f5b942" />

                <Suspense
                  fallback={
                    <mesh position={[0, 0, 0]}>
                      <boxGeometry args={[1.2, 1.2, 1.2]} />
                      <meshStandardMaterial color="#f5b942" wireframe />
                    </mesh>
                  }
                >
                  {activeAsset.modelUrl ? (
                    <RealGLTFModel
                      url={activeAsset.modelUrl}
                      materialPreset={materialPreset}
                      color={activeColor}
                      showGrid={showGrid}
                    />
                  ) : (
                    <HighDetailSculptModel
                      color={activeColor}
                      materialPreset={materialPreset}
                      showGrid={showGrid}
                    />
                  )}
                </Suspense>

                <OrbitControls
                  ref={studioControlsRef}
                  target={[0, 0, 0]}
                  makeDefault
                  autoRotate={false}
                  minDistance={1.3}
                  maxDistance={8}
                  enableDamping
                  dampingFactor={0.05}
                  maxPolarAngle={Math.PI / 2 - 0.02}
                />

                <Environment preset="city" />
              </Canvas>
            )}

            {/* Bottom-Center Floating Material & Palette Bar (Matching Screenshot) */}
            {!isGenerating && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-black/80 backdrop-blur-xl border border-white/15 shadow-2xl">
                {/* Thumbnail mode */}
                <button
                  onClick={() => setMaterialPreset("color")}
                  className={`w-7 h-7 rounded-full overflow-hidden border transition-transform ${
                    materialPreset === "color" ? "border-white scale-110 shadow-md" : "border-white/20 opacity-70"
                  }`}
                  title="Texture PBR Gốc"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={activeAsset.thumbnail} alt="" className="w-full h-full object-cover" />
                </button>

                {/* White Clay Sphere */}
                <button
                  onClick={() => setMaterialPreset("clay")}
                  className={`w-7 h-7 rounded-full bg-[#e5e7eb] border transition-transform ${
                    materialPreset === "clay" ? "border-white scale-110 shadow-[0_0_10px_#ffffff]" : "border-white/20 opacity-70"
                  }`}
                  title="Phôi Đất Sét Trắng (White Clay Sculpt)"
                />

                {/* Holographic Iridescent Sphere */}
                <button
                  onClick={() => setMaterialPreset("iridescent")}
                  className={`w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 via-pink-400 to-cyan-400 border transition-transform ${
                    materialPreset === "iridescent" ? "border-white scale-110 shadow-[0_0_10px_#c084fc]" : "border-white/20 opacity-70"
                  }`}
                  title="Ngọc Ánh Hologram (Iridescent)"
                />

                {/* Wireframe toggle */}
                <button
                  onClick={() => setMaterialPreset(materialPreset === "wireframe" ? "clay" : "wireframe")}
                  className={`w-7 h-7 rounded-full flex items-center justify-center border font-mono text-xs transition-transform ${
                    materialPreset === "wireframe" ? "border-[#f5b942] text-[#f5b942] bg-[#f5b942]/20 scale-110" : "border-white/20 text-white/50"
                  }`}
                  title="Chế độ lưới (Quad Mesh Wireframe)"
                >
                  ▦
                </button>

                <div className="w-[1px] h-5 bg-white/20 mx-1" />

                {/* Color swatches */}
                {[
                  { name: "Gray", hex: "#6b7280" },
                  { name: "Bronze", hex: "#b45309" },
                  { name: "Dark", hex: "#1f2937" },
                  { name: "Cyan", hex: "#06b6d4" },
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setActiveColor(c.hex);
                      setMaterialPreset("color");
                    }}
                    className={`w-6 h-6 rounded-full border transition-transform ${
                      activeColor === c.hex && materialPreset === "color"
                        ? "border-white scale-110"
                        : "border-white/20 opacity-70"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            )}

            {/* Bottom Floating Action Bar */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 shadow-2xl">
              <button
                onClick={handleStartGenerate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 text-xs font-semibold text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <span>🟡</span>
                <span>Thử lại</span>
              </button>

              <button
                onClick={handleSendToFabrication}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#f5b942]/20 hover:bg-[#f5b942]/30 border border-[#f5b942]/40 text-xs font-bold text-[#f5b942] transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{addedSuccess ? "✓ Đã thêm vào giỏ in" : "Đặt In 3D"}</span>
              </button>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer ${
                  isFavorite ? "text-amber-400" : "text-white/60"
                }`}
                title="Yêu thích"
              >
                <Star className="w-4 h-4" />
              </button>

              <button
                onClick={() => alert("Đã sao chép liên kết chia sẻ mô hình!")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 text-xs font-semibold text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia sẻ</span>
              </button>

              <button
                onClick={() => alert(`Xuất file 3D của ${activeAsset.name} (GLB, STL, OBJ) thành công!`)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#9333ea] hover:bg-[#a855f7] text-white font-bold text-xs transition-colors shadow-[0_0_15px_rgba(147,51,234,0.4)] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất file</span>
              </button>
            </div>
          </div>
        </main>

        {/* ── Col 3: Right Drawer (Kho Mẫu & Thông Số) ── */}
        <aside
          className="w-[300px] md:w-[320px] h-full min-h-0 border-l border-white/10 flex flex-col shrink-0 z-20 overflow-hidden"
          style={{ backgroundColor: "#111218" }}
          data-lenis-prevent="true"
        >
          {/* Drawer Top Tabs */}
          <div className="shrink-0 flex border-b border-white/10 text-xs font-bold font-mono">
            <button
              onClick={() => setRightTab("assets")}
              className={`flex-1 py-3 text-center transition-colors border-b-2 cursor-pointer ${
                rightTab === "assets"
                  ? "border-white text-white bg-white/[0.02]"
                  : "border-transparent text-white/40 hover:text-white"
              }`}
            >
              Kho Mẫu 3D ({assetsList.length})
            </button>
            <button
              onClick={() => setRightTab("property")}
              className={`flex-1 py-3 text-center transition-colors border-b-2 cursor-pointer ${
                rightTab === "property"
                  ? "border-white text-white bg-white/[0.02]"
                  : "border-transparent text-white/40 hover:text-white"
              }`}
            >
              Thông Số Kỹ Thuật
            </button>
          </div>

          {/* Drawer Body Content */}
          <div
            className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar"
            data-lenis-prevent="true"
            style={{ overscrollBehavior: "contain" }}
          >
            {rightTab === "assets" ? (
              <div className="space-y-4">
                {/* Upgrade Box */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-amber-300">Nâng cấp Pro để mở khóa xuất file STL/GLB không giới hạn và tính năng in đa màu.</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/60">Tiết kiệm 50% hôm nay</span>
                    <button
                      onClick={() => alert("Nâng cấp thành viên Pro")}
                      className="px-2.5 py-1 rounded bg-[#f5b942] text-black font-bold text-[10px] cursor-pointer"
                    >
                      Nâng cấp Pro
                    </button>
                  </div>
                </div>

                {/* Filter & View icon bar */}
                <div className="flex items-center justify-between text-xs text-white/50 px-1">
                  <div className="flex items-center gap-2">
                    <button className="text-white">⊞</button>
                    <button className="hover:text-white">★</button>
                    <button className="hover:text-white">▼</button>
                  </div>
                  <span className="text-[11px] text-white/50">
                    Bản in đã kiểm định
                  </span>
                </div>

                {/* Upload 3D Model Tile */}
                <button
                  onClick={() => alert("Tính năng tải file 3D trực tiếp (OBJ, FBX, STL, GLB <= 150MB) đang kết nối MinIO")}
                  className="w-full py-4 rounded-xl border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#f5b942]/50 flex flex-col items-center justify-center gap-1.5 transition-colors group cursor-pointer"
                >
                  <Box className="w-5 h-5 text-white/50 group-hover:text-[#f5b942] transition-colors" />
                  <span className="text-xs font-bold text-white/90">Tải Lên File 3D Của Bạn</span>
                  <span className="text-[10px] text-white/40 font-mono">GLB, STL, OBJ, FBX (Tối đa 150MB)</span>
                </button>

                {/* Asset Gallery Grid */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2.5">
                    {assetsList.map((asset) => {
                      const isSelected = activeAsset.id === asset.id;
                      return (
                        <div
                          key={asset.id}
                          onClick={() => {
                            setActiveAsset(asset);
                            setReferenceImg(asset.thumbnail);
                            setActiveColor(asset.baseColor);
                          }}
                          className={`relative aspect-square rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 group ${
                            isSelected
                              ? "border-[#a855f7] ring-2 ring-[#a855f7]/40 shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-[1.02]"
                              : "border-white/10 hover:border-white/30"
                          }`}
                          style={{ backgroundColor: "#181922" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={asset.thumbnail}
                            alt={asset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                          <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-white truncate max-w-[80%]">
                              {asset.name}
                            </span>
                            <Info className="w-3 h-3 text-white/40 hover:text-white" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Property Tab Content */
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-mono uppercase text-white/40 block mb-1">Tên mô hình</span>
                  <h3 className="text-base font-bold text-white">{activeAsset.name}</h3>
                </div>

                {/* Mesh Statistics */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/40">Mặt lưới (Faces):</span>
                    <span className="text-[#f5b942] font-bold">{activeAsset.faces.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Đỉnh (Vertices):</span>
                    <span className="text-white/80">{activeAsset.vertices.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Kích thước hoàn thiện:</span>
                    <span className="text-white/80">{activeAsset.dimensions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Cấu trúc đa giác:</span>
                    <span className="text-green-400">Kín nước (Watertight Manifold)</span>
                  </div>
                </div>

                {/* 3D Printing Estimates */}
                <div className="p-3.5 rounded-2xl bg-[#f5b942]/5 border border-[#f5b942]/20 space-y-2.5 font-mono text-xs">
                  <span className="text-[10px] uppercase tracking-wider text-[#f5b942] block font-bold">
                    Ước tính chế tác in 3D
                  </span>
                  <div className="flex justify-between">
                    <span className="text-white/50">Khối lượng in:</span>
                    <span className="text-white/90">{activeAsset.printWeight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Thời gian chạy máy:</span>
                    <span className="text-white/90">{activeAsset.printTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Giá ước tính:</span>
                    <span className="text-[#f5b942] font-bold text-sm">450.000₫</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => alert(`Đã chuẩn bị tải gói file 3D của ${activeAsset.name} (GLB, STL, OBJ).`)}
                    className="w-full py-3 rounded-xl border border-white/20 hover:border-white/50 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải File 3D (GLB / STL)</span>
                  </button>

                  <button
                    onClick={handleSendToFabrication}
                    className="w-full py-3 rounded-xl bg-[#f5b942] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,185,66,0.3)] hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{addedSuccess ? "✓ Đã đưa vào giỏ in" : "Gửi Sang Xưởng Đặt In 3D"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
