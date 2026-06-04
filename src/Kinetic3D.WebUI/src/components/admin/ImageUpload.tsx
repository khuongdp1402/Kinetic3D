"use client";

import React, { useState } from "react";

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      // 1. Get presigned URL
      const res = await fetch("http://localhost:5000/api/uploads/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      });
      const data = await res.json();
      
      // 2. Upload file to MinIO
      await fetch(data.url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      setUrl(data.url.split("?")[0]);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border border-neutral-700 rounded bg-neutral-800/50">
      <h3 className="mb-2 font-semibold">Product Image</h3>
      <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-neutral-700 file:text-white hover:file:bg-neutral-600 cursor-pointer" />
      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || uploading}
        className="mt-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-neutral-600 px-4 py-2 rounded transition-colors text-white"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
      {url && <p className="mt-2 text-sm text-green-400">Uploaded: {url}</p>}
    </div>
  );
}
