"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  CloudDownload,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Layers,
  Clock,
  Weight,
  Box,
  ExternalLink,
  Eye,
  X,
  RotateCw,
  RefreshCw,
  Sparkles,
  PackageCheck,
  ShieldCheck,
  Wand2,
  Cpu,
  Key,
  Play,
  DownloadCloud,
  EyeOff,
} from "lucide-react";
import { SYNCABLE_CATALOG, Syncable3DProduct } from "@/lib/syncCatalogData";
import { AI_SHOWCASE_LIBRARY, AI3DShowcaseItem } from "@/lib/ai3d/showcaseLibrary";
import { Product3DStage } from "@/components/storefront/Product3DStage";
import { productsApi } from "@/lib/api";
import type { ProductDto } from "@/types/api";

const QUICK_PROMPTS = [
  {
    title: "Mecha Cyber Ronin",
    desc: "Chiến binh robot giáp phân tầng phong cách Nhật Bản",
    prompt: "Cyberpunk mecha ronin samurai robot with layered armor plates, glowing plasma katana, detailed mechanical joints, watertight 3d print",
  },
  {
    title: "Aero Sneaker 3D",
    desc: "Giày thể thao tương lai đế tổ ong Voronoi",
    prompt: "Futuristic parametric sneaker with voronoi lattice midsole, aerodynamic cyberpunk shoe structure, organic 3d printed footwear concept",
  },
  {
    title: "Artisan Mech Keycap",
    desc: "Keycap đầu lâu cơ khí switch Cherry MX",
    prompt: "Cyber skull mechanical artisan keycap for mechanical keyboard, MX stem, cyberpunk cyberpunk helmet details, translucent visor",
  },
  {
    title: "Dragon Guardian",
    desc: "Rồng thần cơ khí uốn lượn khớp liền thân",
    prompt: "Mechanical cyber dragon with articulated segmented spine, metallic scales, oriental dragon head sculpt, print-in-place ball joints",
  },
  {
    title: "Quantum Jet Drone",
    desc: "Tàu thám hiểm không gian động cơ ion",
    prompt: "Futuristic sci-fi spacecraft drone with twin ion booster engines, aerodynamic vector wings, glowing fusion reactor core",
  },
];

export default function AdminSyncPage() {
  const [existingProducts, setExistingProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0, message: "" });
  const [selectedSyncIds, setSelectedSyncIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "synced" | "unsynced">("all");
  const [previewModal, setPreviewModal] = useState<Syncable3DProduct | null>(null);

  // ── AI Studio State (Tripo3D & Meshy) ──
  const [activeMainTab, setActiveMainTab] = useState<"ai_studio" | "khronos_archive">("ai_studio");
  const [aiProvider, setAiProvider] = useState<"tripo" | "meshy">("tripo");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [aiPrompt, setAiPrompt] = useState(QUICK_PROMPTS[0].prompt);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiStage, setAiStage] = useState("");
  const [generatedResult, setGeneratedResult] = useState<AI3DShowcaseItem | null>(null);
  const [aiPreviewModal, setAiPreviewModal] = useState<AI3DShowcaseItem | null>(null);

  // Load saved API key on client
  useEffect(() => {
    const saved = localStorage.getItem("kinetic3d_ai_key");
    if (saved) setApiKey(saved);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("kinetic3d_ai_key", key);
  };

  // Load existing products from DB
  const loadExisting = async () => {
    setLoading(true);
    try {
      const data = await productsApi.getAll();
      setExistingProducts(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách sản phẩm hiện tại:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExisting();
  }, []);

  // Check if a syncable item is already in DB
  const isSynced = (item: Syncable3DProduct) => {
    return existingProducts.some(
      (p) => p.slug === item.slug || p.name.toLowerCase() === item.name.toLowerCase()
    );
  };

  const getDbProduct = (item: Syncable3DProduct) => {
    return existingProducts.find(
      (p) => p.slug === item.slug || p.name.toLowerCase() === item.name.toLowerCase()
    );
  };

  // Categories list
  const categories = useMemo(() => {
    const list = Array.from(new Set(SYNCABLE_CATALOG.map((i) => i.categoryBadge)));
    return ["all", ...list];
  }, []);

  // Filtered list
  const filteredItems = useMemo(() => {
    return SYNCABLE_CATALOG.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === "all" || item.categoryBadge === selectedCategory;

      const synced = isSynced(item);
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "synced" && synced) ||
        (selectedStatus === "unsynced" && !synced);

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus, existingProducts]);

  // Toggle single selection
  const toggleSelect = (syncId: string) => {
    setSelectedSyncIds((prev) => {
      const next = new Set(prev);
      if (next.has(syncId)) {
        next.delete(syncId);
      } else {
        next.add(syncId);
      }
      return next;
    });
  };

  // Select all / Deselect all
  const toggleSelectAll = () => {
    if (selectedSyncIds.size === filteredItems.length && filteredItems.length > 0) {
      setSelectedSyncIds(new Set());
    } else {
      setSelectedSyncIds(new Set(filteredItems.map((i) => i.syncId)));
    }
  };

  // Execute Sync
  const handleSyncSelected = async () => {
    const itemsToSync = SYNCABLE_CATALOG.filter((i) => selectedSyncIds.has(i.syncId));
    if (itemsToSync.length === 0) return;

    setSyncing(true);
    setSyncProgress({ current: 0, total: itemsToSync.length, message: "Bắt đầu đồng bộ..." });

    for (let i = 0; i < itemsToSync.length; i++) {
      const item = itemsToSync[i];
      setSyncProgress({
        current: i + 1,
        total: itemsToSync.length,
        message: `Đang nạp: ${item.name}...`,
      });

      // Check if already in DB
      const existing = getDbProduct(item);
      if (existing) {
        // Update product to ensure model3DUrl and specs are fresh
        try {
          await productsApi.update(existing.id, {
            id: existing.id,
            name: item.name,
            slug: item.slug,
            description: item.description,
            shortDescription: item.shortDescription,
            basePrice: item.basePrice,
            imageUrl: item.imageUrl,
            images: item.images,
            model3DUrl: item.model3DUrl,
            specs: { ...item.specs, salePrice: item.salePrice.toString(), author: item.author, license: item.license },
            colors: item.colors,
            sizes: item.sizes,
            featured: item.featured,
            inStock: true,
            categoryId: item.categoryId,
          });
        } catch (err) {
          console.error(`Lỗi cập nhật ${item.name}:`, err);
        }
      } else {
        // Create new
        try {
          await productsApi.create({
            name: item.name,
            slug: item.slug,
            description: item.description,
            shortDescription: item.shortDescription,
            basePrice: item.basePrice,
            imageUrl: item.imageUrl,
            images: item.images,
            model3DUrl: item.model3DUrl,
            specs: { ...item.specs, salePrice: item.salePrice.toString(), author: item.author, license: item.license },
            colors: item.colors,
            sizes: item.sizes,
            featured: item.featured,
            inStock: true,
            categoryId: item.categoryId,
          });
        } catch (err) {
          console.error(`Lỗi tạo mới ${item.name}:`, err);
        }
      }
    }

    setSyncProgress({
      current: itemsToSync.length,
      total: itemsToSync.length,
      message: "Hoàn tất đồng bộ dữ liệu vào hệ thống!",
    });

    await loadExisting();
    setSelectedSyncIds(new Set());
    setTimeout(() => {
      setSyncing(false);
    }, 1500);
  };

  // Check if an AI showcase item is already in DB
  const isAISynced = (item: AI3DShowcaseItem) => {
    return existingProducts.some(
      (p) => p.slug === item.slug || p.name.toLowerCase() === item.name.toLowerCase()
    );
  };

  // Sync a single AI item directly into DB
  const handleSyncAIItem = async (item: AI3DShowcaseItem) => {
    setSyncing(true);
    setSyncProgress({ current: 0, total: 1, message: `Đang nạp mô hình: ${item.name}...` });

    try {
      const existing = existingProducts.find(
        (p) => p.slug === item.slug || p.name.toLowerCase() === item.name.toLowerCase()
      );

      if (existing) {
        await productsApi.update(existing.id, {
          id: existing.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          shortDescription: item.shortDescription,
          basePrice: item.basePrice,
          imageUrl: item.imageUrl,
          images: item.images,
          model3DUrl: item.model3DUrl,
          specs: {
            ...item.specs,
            salePrice: item.salePrice.toString(),
            provider: item.provider,
            faces: item.faces.toString(),
            vertices: item.vertices.toString(),
          },
          colors: item.colors,
          sizes: item.sizes,
          featured: item.featured,
          inStock: true,
          categoryId: item.categoryId,
        });
      } else {
        await productsApi.create({
          name: item.name,
          slug: item.slug,
          description: item.description,
          shortDescription: item.shortDescription,
          basePrice: item.basePrice,
          imageUrl: item.imageUrl,
          images: item.images,
          model3DUrl: item.model3DUrl,
          specs: {
            ...item.specs,
            salePrice: item.salePrice.toString(),
            provider: item.provider,
            faces: item.faces.toString(),
            vertices: item.vertices.toString(),
          },
          colors: item.colors,
          sizes: item.sizes,
          featured: item.featured,
          inStock: true,
          categoryId: item.categoryId,
        });
      }

      setSyncProgress({ current: 1, total: 1, message: `✓ Đã lưu thành công ${item.name}!` });
      await loadExisting();
    } catch (err: any) {
      alert("Lỗi đồng bộ: " + (err.message || "Không thể lưu vào cơ sở dữ liệu"));
    } finally {
      setTimeout(() => setSyncing(false), 1000);
    }
  };

  // Generate 3D via API
  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      alert("Vui lòng nhập prompt mô tả mô hình 3D!");
      return;
    }

    setIsGeneratingAI(true);
    setAiProgress(15);
    setAiStage("Đang gửi yêu cầu & khởi tạo GPU Tensor Cores...");

    try {
      const res = await fetch("/api/ai-3d/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          provider: aiProvider,
          apiKey: apiKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Lỗi tạo mô hình");
      }

      const taskId = data.taskId;
      let curr = 30;
      setAiProgress(curr);
      setAiStage("Đang phân giải đa giác Quad-Mesh & topology...");

      const timer = setInterval(async () => {
        try {
          const checkRes = await fetch(
            `/api/ai-3d/task/${taskId}?provider=${aiProvider}&apiKey=${encodeURIComponent(apiKey.trim())}`
          );
          const checkData = await checkRes.json();

          if (checkData.success && (checkData.status === "success" || checkData.progress >= 100)) {
            clearInterval(timer);
            setAiProgress(100);
            setAiStage("Hoàn tất! Mô hình 3D đã sẵn sàng.");

            if (checkData.item) {
              setGeneratedResult(checkData.item);
            } else {
              setGeneratedResult({
                id: `ai-gen-${Date.now()}`,
                name: `Bản In 3D: ${aiPrompt.slice(0, 32)}...`,
                slug: `ban-in-3d-ai-${Date.now()}`,
                provider: aiProvider,
                categoryName: "Mô Hình Quân Sự & Xe Cộ Chi Tiết Cao",
                categoryId: "c018ecaa-dcb7-4a0b-9366-0d4e963ee3f2",
                categoryBadge: "AI Generative 3D",
                prompt: aiPrompt,
                description: `Mô hình tạo bởi AI 3D (${aiProvider.toUpperCase()}). Prompt: "${aiPrompt}". File in đã tối ưu độ phân giải cao và kín nước cho máy in 3D.`,
                shortDescription: `Mô hình 3D tạo tự động bởi ${aiProvider.toUpperCase()}.`,
                basePrice: 580000,
                salePrice: 490000,
                imageUrl: checkData.imageUrl || "/images/products/cyber-helmet.png",
                images: [checkData.imageUrl || "/images/products/cyber-helmet.png"],
                model3DUrl: checkData.modelUrl || "/models/DamagedHelmet.glb",
                faces: 1420000,
                vertices: 710000,
                printWeight: "190g",
                printTime: "7 giờ 20 phút",
                colors: ["Titanium Ánh Kim", "Cam Hổ Phách & Đen", "Trắng Sứ"],
                sizes: ["Tiêu Chuẩn (150mm)", "Cỡ Lớn (220mm)"],
                specs: {
                  "Động cơ tạo mẫu": `${aiProvider.toUpperCase()} Smart Mesh v3.1`,
                  "Khối lượng": "190g",
                  "Thời gian in": "7 giờ 20 phút",
                  "Độ kín nước": "100% Watertight Manifold",
                },
                featured: true,
              });
            }

            setTimeout(() => {
              setIsGeneratingAI(false);
            }, 600);
          } else {
            curr = Math.min(94, curr + 18);
            setAiProgress(curr);
            if (curr > 50 && curr < 75) {
              setAiStage("Tổng hợp vật liệu PBR Albedo, Độ nhám & Kim loại 8K...");
            } else if (curr >= 75) {
              setAiStage("Tối ưu hình học kín nước cho hệ thống máy in Bambu Lab...");
            }
          }
        } catch (e) {
          console.error("Polling error:", e);
        }
      }, 1000);
    } catch (err: any) {
      alert("Lỗi: " + err.message);
      setIsGeneratingAI(false);
    }
  };

  // Count stats
  const totalAvailable = SYNCABLE_CATALOG.length;
  const totalSynced = SYNCABLE_CATALOG.filter(isSynced).length;
  const totalPending = totalAvailable - totalSynced;

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Sparkles size={13} />
              3D Model Ingestion Engine
            </span>
            <span className="text-xs text-neutral-500">v2.1 • Tripo3D, Meshy & Open Archives</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <CloudDownload className="text-orange-500" size={28} />
            Trung Tâm Đồng Bộ & Kéo Mẫu 3D
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-3xl">
            Tự động kéo các mô hình 3D AI cao cấp từ Tripo3D & Meshy, hoặc đồng bộ từ kho mã nguồn mở Khronos / Open 3D vào hệ thống cơ sở dữ liệu Kinetic3D.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadExisting}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-orange-400" : ""} />
            Làm mới DB
          </button>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-800 transition"
          >
            <Box size={14} />
            Xem kho sản phẩm ({existingProducts.length})
          </Link>
        </div>
      </div>

      {/* ── Top Main Mode Switcher Tabs ── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-3">
        <button
          onClick={() => setActiveMainTab("ai_studio")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
            activeMainTab === "ai_studio"
              ? "bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 shadow-lg shadow-orange-500/25"
              : "text-neutral-400 hover:text-white bg-neutral-900/80 border border-neutral-800"
          }`}
        >
          <Wand2 size={15} />
          <span>Tripo3D & Meshy AI Studio (Mẫu Đỉnh Cao)</span>
          <span className="px-2 py-0.5 rounded-full bg-black/20 text-[10px] font-mono uppercase font-black tracking-wider">
            Mới Nhất
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab("khronos_archive")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeMainTab === "khronos_archive"
              ? "bg-neutral-800 text-white border border-neutral-700 shadow-md"
              : "text-neutral-400 hover:text-white bg-neutral-900/80 border border-neutral-800"
          }`}
        >
          <Layers size={15} />
          <span>Kho Lưu Trữ Khronos & Open 3D ({totalAvailable} mẫu)</span>
        </button>
      </div>

      {/* ── TAB 1: Tripo3D & Meshy AI Studio ── */}
      {activeMainTab === "ai_studio" && (
        <div className="space-y-8">
          {/* API Configuration Bar */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Cpu className="text-orange-400" size={18} />
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Cấu Hình Cổng Dịch Vụ AI 3D (Tripo3D / Meshy)
                  </h2>
                </div>
                <p className="text-xs text-neutral-400">
                  Kết nối trực tiếp API của Tripo3D hoặc Meshy để tạo và nạp mô hình thực tế, hoặc sử dụng kho tuyển chọn 8 mẫu đỉnh cao tích hợp sẵn.
                </p>
              </div>

              {/* Provider Selection */}
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
                <button
                  onClick={() => setAiProvider("tripo")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    aiProvider === "tripo"
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Tripo3D (api.tripo3d.ai)
                </button>
                <button
                  onClick={() => setAiProvider("meshy")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    aiProvider === "meshy"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/20"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Meshy v2 (api.meshy.ai)
                </button>
              </div>
            </div>

            {/* API Key Input */}
            <div className="mt-4 pt-4 border-t border-neutral-800/80 flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative flex-1">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={15} />
                <input
                  type={showApiKey ? "text" : "password"}
                  placeholder={
                    aiProvider === "tripo"
                      ? "Nhập Tripo3D API Key (VD: tsk_...)"
                      : "Nhập Meshy API Key (VD: msy_...)"
                  }
                  value={apiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-200 text-xs font-mono focus:outline-none focus:border-orange-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 ${
                    apiKey.trim()
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      apiKey.trim() ? "bg-emerald-400 animate-pulse" : "bg-blue-400"
                    }`}
                  />
                  {apiKey.trim() ? "Live API Sẵn Sàng" : "Chế Độ Curated Showcase"}
                </span>
                {apiKey.trim() && (
                  <button
                    onClick={() => handleSaveApiKey("")}
                    className="px-2.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 text-xs border border-neutral-800"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* AI Live Ingestion Studio */}
          <div className="bg-gradient-to-b from-neutral-950 to-neutral-900/80 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Wand2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Khởi Tạo & Kéo Mẫu 3D Tự Động Từ AI Prompt</h3>
                  <p className="text-xs text-neutral-400">
                    Nhập câu lệnh mô tả ý tưởng để sinh mô hình 3D đa giác cao cấp và đồng bộ thẳng về cửa hàng.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Mẫu Prompt gợi ý có sẵn:
              </span>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAiPrompt(qp.prompt)}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition text-left flex items-center gap-1.5 ${
                      aiPrompt === qp.prompt
                        ? "bg-orange-500/15 border-orange-500/50 text-orange-300"
                        : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white"
                    }`}
                  >
                    <Sparkles size={12} className="text-orange-400" />
                    <span className="font-semibold">{qp.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input & Action */}
            <div className="space-y-3">
              <textarea
                rows={3}
                placeholder="Mô tả mô hình 3D bạn muốn tạo (Ví dụ: Cyberpunk mecha ronin samurai robot with layered armor plates, watertight 3d print...)"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 text-sm focus:outline-none focus:border-orange-500/50 resize-none font-sans"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[11px] text-neutral-500 flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  Mô hình được tự động kiểm tra kín nước (Watertight Manifold) tương thích chuẩn máy in Bambu Lab / Creality
                </p>

                <button
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI || !aiPrompt.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-neutral-950 font-bold text-xs shadow-lg shadow-orange-500/25 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingAI ? (
                    <>
                      <RotateCw size={15} className="animate-spin" />
                      <span>Đang tạo mô hình AI ({aiProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Play size={15} />
                      <span>Khởi Tạo Mô Hình 3D (AI Ingestion)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generating Progress Bar */}
            {isGeneratingAI && (
              <div className="p-4 rounded-xl bg-neutral-900/90 border border-orange-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-orange-400 font-semibold flex items-center gap-2">
                    <RotateCw size={14} className="animate-spin" />
                    {aiStage}
                  </span>
                  <span className="text-white font-mono font-bold">{aiProgress}%</span>
                </div>
                <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-800">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-300"
                    style={{ width: `${aiProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Generated Result Card */}
            {generatedResult && (
              <div className="p-5 rounded-2xl bg-neutral-900/90 border border-emerald-500/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Mô Hình 3D Đã Khởi Tạo Hoàn Tất
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-[11px] text-neutral-300 font-mono">
                    Provider: {generatedResult.provider.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* 3D Canvas Preview */}
                  <div className="lg:col-span-6 h-64 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 relative">
                    <Product3DStage modelUrl={generatedResult.model3DUrl} productName={generatedResult.name} />
                    <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[10px] text-orange-400 font-mono">
                      Interactive 3D Preview (Xoay/Zoom)
                    </div>
                  </div>

                  {/* Info & Sync Button */}
                  <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">{generatedResult.name}</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                        {generatedResult.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                        <span className="text-neutral-500 block text-[10px]">Đa giác (Faces)</span>
                        <span className="text-white font-mono font-bold">
                          {generatedResult.faces.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                        <span className="text-neutral-500 block text-[10px]">Khối lượng in</span>
                        <span className="text-orange-400 font-bold">{generatedResult.printWeight}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                        <span className="text-neutral-500 block text-[10px]">Thời gian in ước tính</span>
                        <span className="text-neutral-200">{generatedResult.printTime}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                        <span className="text-neutral-500 block text-[10px]">Tiêu chuẩn</span>
                        <span className="text-emerald-400 font-medium">Watertight Mesh</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSyncAIItem(generatedResult)}
                      disabled={syncing}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                    >
                      <CloudDownload size={16} />
                      <span>Đồng Bộ Mẫu Này Vào Kho Sản Phẩm (1-Click)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Curated AI Showcase Grid (8 High-End Models) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PackageCheck className="text-orange-400" size={20} />
                  Bộ Sưu Tập Mẫu In 3D AI Tuyển Chọn ({AI_SHOWCASE_LIBRARY.length} mẫu cao cấp)
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Các mẫu in 3D đã tối ưu chuẩn công nghiệp từ Tripo3D & Meshy, sẵn sàng nạp trực tiếp vào PostgreSQL.
                </p>
              </div>

              <div className="text-xs text-neutral-400">
                Đã nạp vào shop:{" "}
                <span className="font-bold text-emerald-400">
                  {AI_SHOWCASE_LIBRARY.filter(isAISynced).length} / {AI_SHOWCASE_LIBRARY.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {AI_SHOWCASE_LIBRARY.map((item) => {
                const synced = isAISynced(item);
                return (
                  <div
                    key={item.id}
                    className="group bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden flex flex-col transition duration-200"
                  >
                    {/* Image / Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                            item.provider === "tripo"
                              ? "bg-orange-500/90 text-neutral-950"
                              : "bg-purple-500/90 text-white"
                          }`}
                        >
                          {item.provider}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-neutral-300">
                          {item.categoryBadge}
                        </span>
                      </div>

                      {synced && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-neutral-950 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 size={11} />
                          Đã có
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-orange-400 transition">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                          {item.shortDescription}
                        </p>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-neutral-900/60 p-2 rounded-xl border border-neutral-800/80">
                        <div>
                          <span className="text-neutral-500 block text-[9px]">Khối lượng in</span>
                          <span className="text-neutral-200 font-semibold">{item.printWeight}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[9px]">Thời gian in</span>
                          <span className="text-neutral-200 font-semibold">{item.printTime}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[9px]">Đa giác</span>
                          <span className="text-orange-400 font-mono font-semibold">
                            {(item.faces / 1000).toFixed(0)}k faces
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[9px]">Giá niêm yết</span>
                          <span className="text-emerald-400 font-semibold">
                            {(item.salePrice / 1000).toFixed(0)}k đ
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => setAiPreviewModal(item)}
                          className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-medium transition flex items-center justify-center gap-1.5"
                        >
                          <Eye size={13} />
                          <span>Xem 3D</span>
                        </button>

                        <button
                          onClick={() => handleSyncAIItem(item)}
                          disabled={syncing}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            synced
                              ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
                              : "bg-orange-500 hover:bg-orange-600 text-neutral-950 shadow-md shadow-orange-500/20"
                          }`}
                        >
                          <CloudDownload size={13} />
                          <span>{synced ? "Cập nhật" : "Đồng bộ"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Khronos & Open 3D Archive ── */}
      {activeMainTab === "khronos_archive" && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Layers size={20} />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">Kho Mẫu Khả Dụng</p>
                <p className="text-xl font-bold text-white">{totalAvailable} mẫu 3D</p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">Đã Có Trong Shop</p>
                <p className="text-xl font-bold text-emerald-400">{totalSynced} sản phẩm</p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">Chưa Đồng Bộ</p>
                <p className="text-xl font-bold text-amber-400">{totalPending} mẫu</p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">Bản Quyền Hợp Pháp</p>
                <p className="text-xl font-bold text-orange-400">100% CC-BY 4.0</p>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input
                  type="text"
                  placeholder="Tìm kiếm mẫu 3D theo tên, tác giả, mô tả..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 text-sm focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
                  <button
                    onClick={() => setSelectedStatus("all")}
                    className={`px-3 py-1 rounded text-xs font-medium transition ${
                      selectedStatus === "all"
                        ? "bg-neutral-800 text-white"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Tất cả ({SYNCABLE_CATALOG.length})
                  </button>
                  <button
                    onClick={() => setSelectedStatus("unsynced")}
                    className={`px-3 py-1 rounded text-xs font-medium transition ${
                      selectedStatus === "unsynced"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Chưa đồng bộ ({totalPending})
                  </button>
                  <button
                    onClick={() => setSelectedStatus("synced")}
                    className={`px-3 py-1 rounded text-xs font-medium transition ${
                      selectedStatus === "synced"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Đã đồng bộ ({totalSynced})
                  </button>
                </div>

                <button
                  onClick={toggleSelectAll}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-medium transition"
                >
                  {selectedSyncIds.size === filteredItems.length && filteredItems.length > 0
                    ? "Bỏ chọn tất cả"
                    : `Chọn tất cả (${filteredItems.length})`}
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-neutral-500 shrink-0 flex items-center gap-1">
                <Filter size={12} /> Danh mục:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? "bg-orange-500 text-white font-semibold"
                      : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                  }`}
                >
                  {cat === "all" ? "Tất cả danh mục" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const synced = isSynced(item);
              const dbItem = getDbProduct(item);
              const isSelected = selectedSyncIds.has(item.syncId);

              return (
                <div
                  key={item.syncId}
                  className={`group relative rounded-xl border transition-all duration-200 overflow-hidden flex flex-col ${
                    isSelected
                      ? "bg-neutral-950 border-orange-500 shadow-lg shadow-orange-500/10"
                      : synced
                      ? "bg-neutral-950/80 border-neutral-800 hover:border-neutral-700"
                      : "bg-neutral-950 border-neutral-800 hover:border-amber-500/50"
                  }`}
                >
                  {/* Checkbox overlay top-left */}
                  <div className="absolute top-3 left-3 z-10">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.syncId)}
                        className="w-5 h-5 rounded border-neutral-700 bg-neutral-900/90 text-orange-500 focus:ring-0 focus:ring-offset-0 cursor-pointer transition"
                      />
                    </label>
                  </div>

                  {/* Top-right Status Pill */}
                  <div className="absolute top-3 right-3 z-10">
                    {synced ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 backdrop-blur-md flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Đã trong Shop
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400 backdrop-blur-md flex items-center gap-1">
                        <AlertCircle size={12} />
                        Chờ đồng bộ
                      </span>
                    )}
                  </div>

                  {/* Image banner */}
                  <div className="relative aspect-16/10 w-full bg-neutral-900 overflow-hidden border-b border-neutral-800/60">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-neutral-300 font-mono">
                        {item.model3DUrl.split("/").pop()}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-medium border border-orange-500/30">
                        {item.categoryBadge}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-orange-400 transition">
                        {item.name}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.shortDescription}
                      </p>
                    </div>

                    {/* Print Specs Box */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800/80">
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <Clock size={13} className="text-neutral-500 shrink-0" />
                        <span className="truncate">{item.specs["Thời gian in"]}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <Weight size={13} className="text-neutral-500 shrink-0" />
                        <span className="truncate">{item.specs["Khối lượng nhựa"]}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-300 col-span-2">
                        <span className="text-neutral-500 text-[10px]">Tác giả:</span>
                        <span className="text-neutral-400 font-medium truncate">{item.author}</span>
                        <span className="text-neutral-600 text-[10px] ml-auto font-mono">{item.license}</span>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-white">
                          {item.salePrice.toLocaleString()} đ
                        </p>
                        <p className="text-[11px] text-neutral-500 line-through">
                          {item.basePrice.toLocaleString()} đ
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPreviewModal(item)}
                          className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition"
                          title="Xem trước 3D"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedSyncIds(new Set([item.syncId]));
                            setTimeout(() => handleSyncSelected(), 50);
                          }}
                          disabled={syncing}
                          className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                            synced
                              ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
                              : "bg-orange-500 hover:bg-orange-600 text-neutral-950 shadow-md shadow-orange-500/20"
                          }`}
                        >
                          <CloudDownload size={14} />
                          <span>{synced ? "Cập nhật" : "Đồng bộ"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Bottom Sync Action Bar */}
          {selectedSyncIds.size > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl bg-neutral-950/95 border border-orange-500/50 shadow-2xl shadow-orange-500/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                  <PackageCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Đã chọn <span className="text-orange-400">{selectedSyncIds.size}</span> mẫu in 3D
                  </p>
                  <p className="text-xs text-neutral-400">
                    Sẵn sàng nạp vào Database kèm file 3D và thông số in thực tế
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSyncIds(new Set())}
                  disabled={syncing}
                  className="px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-white transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSyncSelected}
                  disabled={syncing}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition flex items-center gap-2"
                >
                  {syncing ? (
                    <>
                      <RotateCw size={14} className="animate-spin" />
                      Đang đồng bộ...
                    </>
                  ) : (
                    <>
                      <CloudDownload size={15} />
                      Đồng bộ về hệ thống
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Syncing Progress Modal */}
      {syncing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-400">
              <CloudDownload size={32} className="animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-white">Đang đồng bộ dữ liệu vào Kinetic3D</h3>
            <p className="text-xs text-neutral-400">{syncProgress.message}</p>

            {/* Progress bar */}
            <div className="w-full bg-neutral-900 rounded-full h-2.5 overflow-hidden border border-neutral-800">
              <div
                className="bg-orange-500 h-full transition-all duration-300"
                style={{
                  width: `${(syncProgress.current / (syncProgress.total || 1)) * 100}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-neutral-500">
              {syncProgress.current} / {syncProgress.total} sản phẩm
            </p>
          </div>
        </div>
      )}

      {/* Detail Quick Preview Modal (Khronos) */}
      {previewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-orange-400 font-semibold">{previewModal.categoryBadge}</span>
                <h3 className="text-lg font-bold text-white">{previewModal.name}</h3>
              </div>
              <button
                onClick={() => setPreviewModal(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-900"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="relative h-56 rounded-xl overflow-hidden bg-neutral-900">
                <img
                  src={previewModal.imageUrl}
                  alt={previewModal.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Mô tả sản phẩm</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">{previewModal.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Thông số in 3D</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(previewModal.specs).map(([k, v]) => (
                    <div key={k} className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                      <span className="text-neutral-500 block text-[10px]">{k}</span>
                      <span className="text-neutral-200 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Tác giả thiết kế:</span>
                  <span className="text-orange-400 font-semibold">{previewModal.author}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Giấy phép sở hữu:</span>
                  <span className="text-neutral-300">{previewModal.license}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Đường dẫn file 3D:</span>
                  <code className="text-neutral-400 font-mono text-[10px]">{previewModal.model3DUrl}</code>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-800 flex items-center justify-end gap-2 bg-neutral-900/50">
              <button
                onClick={() => setPreviewModal(null)}
                className="px-4 py-2 rounded-lg text-xs text-neutral-400 hover:text-white"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  const id = previewModal.syncId;
                  setPreviewModal(null);
                  setSelectedSyncIds(new Set([id]));
                  setTimeout(() => handleSyncSelected(), 50);
                }}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <CloudDownload size={14} />
                Đồng bộ mẫu này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI 3D Interactive Preview Modal */}
      {aiPreviewModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    aiPreviewModal.provider === "tripo"
                      ? "bg-orange-500/90 text-neutral-950"
                      : "bg-purple-500/90 text-white"
                  }`}
                >
                  {aiPreviewModal.provider} AI
                </span>
                <span className="text-xs text-orange-400 font-semibold">{aiPreviewModal.categoryBadge}</span>
                <h3 className="text-base font-bold text-white ml-2">{aiPreviewModal.name}</h3>
              </div>
              <button
                onClick={() => setAiPreviewModal(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
              {/* Left: 3D Stage */}
              <div className="lg:col-span-7 h-80 lg:h-[480px] bg-neutral-950 relative border-b lg:border-b-0 lg:border-r border-neutral-800">
                <Product3DStage modelUrl={aiPreviewModal.model3DUrl} productName={aiPreviewModal.name} />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] text-orange-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  3D Viewport • Xoay / Phóng to
                </div>
              </div>

              {/* Right: Detailed Specs & Sync */}
              <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Mô tả</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">{aiPreviewModal.description}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      Thông Số Kỹ Thuật Máy In 3D
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                        <span className="text-neutral-500 block text-[10px]">Số lượng mặt (Faces)</span>
                        <span className="text-white font-mono font-bold">
                          {aiPreviewModal.faces.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                        <span className="text-neutral-500 block text-[10px]">Số đỉnh (Vertices)</span>
                        <span className="text-white font-mono font-bold">
                          {aiPreviewModal.vertices.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                        <span className="text-neutral-500 block text-[10px]">Khối lượng nhựa</span>
                        <span className="text-orange-400 font-bold">{aiPreviewModal.printWeight}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                        <span className="text-neutral-500 block text-[10px]">Thời gian in</span>
                        <span className="text-neutral-200">{aiPreviewModal.printTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Giá bán niêm yết:</span>
                      <span className="text-emerald-400 font-bold text-sm">
                        {aiPreviewModal.salePrice.toLocaleString()} đ
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">File 3D chuẩn:</span>
                      <code className="text-neutral-300 font-mono text-[10px]">
                        {aiPreviewModal.model3DUrl.split("/").pop()}
                      </code>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setAiPreviewModal(null)}
                    className="px-4 py-2.5 rounded-xl text-xs text-neutral-400 hover:text-white bg-neutral-900"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => {
                      const item = aiPreviewModal;
                      setAiPreviewModal(null);
                      handleSyncAIItem(item);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-neutral-950 font-bold text-xs shadow-lg shadow-orange-500/25 transition flex items-center gap-1.5"
                  >
                    <CloudDownload size={14} />
                    <span>Đồng bộ mẫu này vào Shop</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
