"use client";

/**
 * Stable device fingerprint generator for machine-level fraud prevention.
 * Combines hardware concurrency, screen dimensions, canvas rendering signature, and user agent traits.
 * Persists in localStorage under `kn3d_did`.
 */
export function getDeviceFingerprint(): string {
  if (typeof window === "undefined") {
    return "server_ssr_device";
  }

  try {
    const existing = localStorage.getItem("kn3d_did");
    if (existing && existing.length > 8) {
      return existing;
    }

    // Generate canvas fingerprint signature
    let canvasHash = 0;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 50;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText("Kinetic3D-Fingerprint-v1", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("Kinetic3D-Fingerprint-v1", 4, 17);
        const dataUrl = canvas.toDataURL();
        for (let i = 0; i < dataUrl.length; i++) {
          canvasHash = (canvasHash << 5) - canvasHash + dataUrl.charCodeAt(i);
          canvasHash |= 0;
        }
      }
    } catch {
      canvasHash = 12345678;
    }

    // Hardware and screen traits
    const screenTraits = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const cpuCores = navigator.hardwareConcurrency || 4;
    const lang = navigator.language || "vi";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Ho_Chi_Minh";

    const rawString = `${screenTraits}_${cpuCores}_${lang}_${timezone}_${canvasHash}`;

    // Simple robust hash
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      const char = rawString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }

    const deviceId = `K3D-DEV-${Math.abs(hash).toString(16).toUpperCase()}-${canvasHash.toString(16).toUpperCase().slice(0, 6)}`;
    localStorage.setItem("kn3d_did", deviceId);
    return deviceId;
  } catch {
    return "K3D-DEV-FALLBACK";
  }
}
