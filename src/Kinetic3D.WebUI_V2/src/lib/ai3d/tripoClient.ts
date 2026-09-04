/**
 * Tripo3D Official OpenAPI Client
 * Documentation: https://platform.tripo3d.ai/docs
 */

export interface TripoTaskOutput {
  model?: string;
  rendered_image?: string;
  base_model?: string;
  pbr_model?: string;
}

export interface TripoTaskData {
  task_id: string;
  type: string;
  status: "queued" | "running" | "success" | "failed" | "cancelled";
  progress: number;
  output?: TripoTaskOutput;
}

export interface TripoApiResponse<T> {
  code: number;
  message?: string;
  data: T;
}

const TRIPO_BASE_URL = "https://api.tripo3d.ai/v2/openapi";

export async function createTripoTextTask(
  prompt: string,
  apiKey?: string
): Promise<TripoTaskData> {
  const token = apiKey || process.env.TRIPO_API_KEY;
  if (!token) {
    throw new Error("Vui lòng cấu hình Tripo3D API Key (TRIPO_API_KEY)");
  }

  const res = await fetch(`${TRIPO_BASE_URL}/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      type: "text_to_model",
      prompt,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Tripo3D API Error (${res.status}): ${errorBody}`);
  }

  const json: TripoApiResponse<TripoTaskData> = await res.json();
  if (json.code !== 0) {
    throw new Error(json.message || "Lỗi khởi tạo tác vụ Tripo3D");
  }

  return json.data;
}

export async function getTripoTaskStatus(
  taskId: string,
  apiKey?: string
): Promise<TripoTaskData> {
  const token = apiKey || process.env.TRIPO_API_KEY;
  if (!token) {
    throw new Error("Vui lòng cấu hình Tripo3D API Key");
  }

  const res = await fetch(`${TRIPO_BASE_URL}/task/${taskId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Tripo3D Query Error (${res.status}): ${errorBody}`);
  }

  const json: TripoApiResponse<TripoTaskData> = await res.json();
  return json.data;
}
