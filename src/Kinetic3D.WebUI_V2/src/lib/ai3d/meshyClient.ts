/**
 * Meshy Official OpenAPI Client
 * Documentation: https://docs.meshy.ai
 */

export interface MeshyModelUrls {
  glb?: string;
  fbx?: string;
  obj?: string;
  usdz?: string;
}

export interface MeshyTaskData {
  id: string;
  mode: "preview" | "refine";
  status: "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED" | "EXPIRED";
  progress: number;
  prompt: string;
  art_style?: string;
  model_urls?: MeshyModelUrls;
  thumbnail_url?: string;
  task_error?: {
    message?: string;
  };
}

const MESHY_BASE_URL = "https://api.meshy.ai/v2";

export async function createMeshyTextTask(
  prompt: string,
  artStyle: string = "realistic",
  apiKey?: string
): Promise<MeshyTaskData> {
  const token = apiKey || process.env.MESHY_API_KEY;
  if (!token) {
    throw new Error("Vui lòng cấu hình Meshy API Key (MESHY_API_KEY)");
  }

  const res = await fetch(`${MESHY_BASE_URL}/text-to-3d`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mode: "preview",
      prompt,
      art_style: artStyle,
      should_remesh: true,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Meshy API Error (${res.status}): ${errorBody}`);
  }

  const json = await res.json();
  return json;
}

export async function getMeshyTaskStatus(
  taskId: string,
  apiKey?: string
): Promise<MeshyTaskData> {
  const token = apiKey || process.env.MESHY_API_KEY;
  if (!token) {
    throw new Error("Vui lòng cấu hình Meshy API Key");
  }

  const res = await fetch(`${MESHY_BASE_URL}/text-to-3d/${taskId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Meshy Query Error (${res.status}): ${errorBody}`);
  }

  const json: MeshyTaskData = await res.json();
  return json;
}
