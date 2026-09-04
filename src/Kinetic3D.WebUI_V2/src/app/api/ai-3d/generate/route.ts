import { NextRequest, NextResponse } from "next/server";
import { createTripoTextTask } from "@/lib/ai3d/tripoClient";
import { createMeshyTextTask } from "@/lib/ai3d/meshyClient";
import { AI_SHOWCASE_LIBRARY } from "@/lib/ai3d/showcaseLibrary";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, provider = "tripo", apiKey } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, message: "Vui lòng cung cấp mô tả (prompt) mô hình 3D" },
        { status: 400 }
      );
    }

    // Check if live API Key is supplied or configured
    const tripoKey = apiKey || process.env.TRIPO_API_KEY;
    const meshyKey = apiKey || process.env.MESHY_API_KEY;

    if (provider === "tripo" && tripoKey) {
      try {
        const task = await createTripoTextTask(prompt, tripoKey);
        return NextResponse.json({
          success: true,
          provider: "tripo",
          taskId: task.task_id,
          message: "Đã gửi yêu cầu khởi tạo tới Tripo3D OpenAPI",
        });
      } catch (err: any) {
        console.warn("Tripo3D Live Call failed, falling back to showcase mode:", err.message);
      }
    }

    if (provider === "meshy" && meshyKey) {
      try {
        const task = await createMeshyTextTask(prompt, "realistic", meshyKey);
        return NextResponse.json({
          success: true,
          provider: "meshy",
          taskId: task.id,
          message: "Đã gửi yêu cầu khởi tạo tới Meshy API v2",
        });
      } catch (err: any) {
        console.warn("Meshy Live Call failed, falling back to showcase mode:", err.message);
      }
    }

    // Showcase / Curated Mode (Matching best relevant showcase item)
    const normalizedPrompt = prompt.toLowerCase();
    const matchedItem =
      AI_SHOWCASE_LIBRARY.find((item) =>
        normalizedPrompt.split(" ").some((word) => word.length > 3 && item.prompt.toLowerCase().includes(word))
      ) ||
      AI_SHOWCASE_LIBRARY.find((item) =>
        item.provider === provider || item.name.toLowerCase().includes(normalizedPrompt)
      ) ||
      AI_SHOWCASE_LIBRARY[0];

    return NextResponse.json({
      success: true,
      provider: "showcase",
      taskId: `showcase-${matchedItem.id}-${Date.now()}`,
      matchedItem,
      message: "Đang phân giải mô hình 3D chất lượng cao từ kho mẫu AI",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi xử lý tạo mô hình 3D" },
      { status: 500 }
    );
  }
}
