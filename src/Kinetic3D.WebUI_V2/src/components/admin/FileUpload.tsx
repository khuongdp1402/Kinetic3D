"use client";

import React, { useState, useRef, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { uploadsApi } from "@/lib/api";
import { Upload, X, CheckCircle, ImageIcon, Box } from "lucide-react";

interface FileUploadProps {
  label: string;
  accept?: string;
  folder: string;
  onUploadComplete?: (url: string) => void;
  currentUrl?: string;
}

const MAX_MODEL_SIZE_MB = 50;

export default function FileUpload({
  label,
  accept,
  folder,
  onUploadComplete,
  currentUrl,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState(currentUrl || "");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isImage = accept?.includes("image");

  const processFile = (f: File) => {
    setError("");
    setFile(f);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) processFile(dropped);
    },
    []
  );

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    setProgress(10);

    try {
      let uploadFile: File = file;

      if (file.type.startsWith("image/")) {
        setProgress(20);
        uploadFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1600,
          fileType: "image/webp",
          useWebWorker: true,
        });
      } else if (file.size > MAX_MODEL_SIZE_MB * 1024 * 1024) {
        throw new Error(`File 3D vượt quá ${MAX_MODEL_SIZE_MB}MB.`);
      }

      setProgress(50);
      const contentType = uploadFile.type || "application/octet-stream";
      const fileName = file.type.startsWith("image/")
        ? file.name.replace(/\.[^.]+$/, ".webp")
        : file.name;

      const { uploadUrl, publicUrl } = await uploadsApi.getPresignedUrl(
        fileName,
        contentType,
        folder
      );

      setProgress(75);
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: uploadFile,
      });

      setProgress(100);
      setUploadedUrl(publicUrl);
      onUploadComplete?.(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tải file lên thất bại.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-neutral-200">{label}</label>

      {/* Preview area */}
      {uploadedUrl && isImage && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={uploadedUrl} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => { setUploadedUrl(""); setFile(null); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-2 left-2 bg-black/60 rounded px-2 py-0.5 text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle size={10} />
            Đã tải lên
          </div>
        </div>
      )}

      {uploadedUrl && !isImage && (
        <div className="flex items-center gap-3 p-3 bg-neutral-800 border border-neutral-700 rounded-xl">
          <Box size={20} className="text-orange-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-neutral-200 truncate font-mono">{uploadedUrl.split("/").pop()}</p>
            <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
              <CheckCircle size={10} /> Đã tải lên
            </p>
          </div>
          <button type="button" onClick={() => { setUploadedUrl(""); setFile(null); }} className="text-neutral-500 hover:text-red-400 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      {!uploadedUrl && (
        <>
          {/* Drop zone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
              isDragging
                ? "border-orange-500 bg-orange-500/10"
                : "border-neutral-700 hover:border-neutral-600 bg-neutral-800/50"
            }`}
          >
            {isImage ? (
              <ImageIcon size={28} className="text-neutral-500" />
            ) : (
              <Upload size={28} className="text-neutral-500" />
            )}
            <div className="text-center">
              <p className="text-sm text-neutral-300 font-medium">
                {file ? file.name : "Kéo thả hoặc click để chọn"}
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                {isImage ? "PNG, JPG, WEBP — tối đa 10MB" : "GLB/GLTF — tối đa 50MB"}
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
              className="hidden"
            />
          </div>

          {/* Upload button + progress */}
          {file && (
            <div className="space-y-2">
              {uploading && (
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-bold text-sm transition-colors"
              >
                {uploading ? `Đang tải lên… ${progress}%` : "Tải lên ngay"}
              </button>
            </div>
          )}
        </>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

