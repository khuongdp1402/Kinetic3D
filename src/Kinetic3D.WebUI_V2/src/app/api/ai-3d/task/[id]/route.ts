import { NextRequest, NextResponse } from "next/server";
import { getTripoTaskStatus } from "@/lib/ai3d/tripoClient";
import { getMeshyTaskStatus } from "@/lib/ai3d/meshyClient";
import { AI_SHOWCASE_LIBRARY } from "@/lib/ai3d/showcaseLibrary";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const searchParams = req.nextUrl.searchParams;
    const provider = searchParams.get("provider") || "tripo";
    const apiKey = searchParams.get("apiKey") || undefined;

    if (taskId.startsWith("showcase-")) {
      // Find matching item from library
      const matched = AI_SHOWCASE_LIBRARY.find((item) => taskId.includes(item.id)) || AI_SHOWCASE_LIBRARY[0];
      return NextResponse.json({
        success: true,
        status: "success",
        progress: 100,
        modelUrl: matched.model3DUrl,
        imageUrl: matched.imageUrl,
        name: matched.name,
        specs: matched.specs,
        item: matched,
      });
    }

    if (provider === "tripo") {
      const data = await getTripoTaskStatus(taskId, apiKey);
      return NextResponse.json({
        success: true,
        status: data.status,
        progress: data.progress,
        modelUrl: data.output?.pbr_model || data.output?.model,
        imageUrl: data.output?.rendered_image,
      });
    }

    if (provider === "meshy") {
      const data = await getMeshyTaskStatus(taskId, apiKey);
      return NextResponse.json({
        success: true,
        status: data.status === "SUCCEEDED" ? "success" : data.status.toLowerCase(),
        progress: data.progress,
        modelUrl: data.model_urls?.glb,
        imageUrl: data.thumbnail_url,
      });
    }

    return NextResponse.json(
      { success: false, message: `Provider không xác định: ${provider}` },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi kiểm tra tiến độ tác vụ 3D" },
      { status: 500 }
    );
  }
}
