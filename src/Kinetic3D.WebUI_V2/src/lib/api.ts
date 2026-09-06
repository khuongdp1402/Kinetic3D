import { useAuthStore } from "@/store/useAuthStore";
import type {
  AdminUserDto,
  AuthResultDto,
  CategoryDto,
  CreateCustomRequestInput,
  CreateOrderInput,
  CreateProductInput,
  CreditPackageDto,
  CustomRequestDto,
  OrderDto,
  PresignedUploadResult,
  ProductDto,
} from "@/types/api";

// Server-side (SSR/RSC) fetches run inside the Next.js container and must reach the backend
// via the Docker network name; browser-side fetches must use the publicly reachable URL.
const API_URL =
  typeof window === "undefined"
    ? process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5099"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5099";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}, authed = false): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (authed) {
    const token = useAuthStore.getState().token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    let message = `Yêu cầu thất bại (${response.status}).`;
    try {
      const errorBody = await response.json();
      message = errorBody.message || errorBody.title || message;
    } catch {
      // response has no JSON body
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const categoriesApi = {
  getAll: () => apiFetch<CategoryDto[]>("/api/categories"),
  getById: (id: string) => apiFetch<CategoryDto>(`/api/categories/${id}`),
  create: (data: Partial<CategoryDto>) =>
    apiFetch<CategoryDto>("/api/categories", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<CategoryDto>) =>
    apiFetch<void>(`/api/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: string) => apiFetch<void>(`/api/categories/${id}`, { method: "DELETE" }),
};

export const productsApi = {
  getAll: () => apiFetch<ProductDto[]>("/api/products"),
  getById: (id: string) => apiFetch<ProductDto>(`/api/products/${id}`),
  create: (data: CreateProductInput) =>
    apiFetch<ProductDto>("/api/products", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: CreateProductInput & { id: string }) =>
    apiFetch<void>(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: string) => apiFetch<void>(`/api/products/${id}`, { method: "DELETE" }),
};

export const ordersApi = {
  create: (data: CreateOrderInput) =>
    apiFetch<OrderDto>("/api/orders", { method: "POST", body: JSON.stringify(data) }, true),
  getAll: () => apiFetch<OrderDto[]>("/api/orders", {}, true),
  getMy: () => apiFetch<OrderDto[]>("/api/orders/my", {}, true),
  getById: (id: string) => apiFetch<OrderDto>(`/api/orders/${id}`),
  lookup: (query: string) =>
    apiFetch<OrderDto>(`/api/orders/lookup?query=${encodeURIComponent(query)}`),
  updateStatus: (id: string, status: string) =>
    apiFetch<OrderDto>(`/api/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ orderId: id, status }) }, true),
};

export const customRequestsApi = {
  create: (data: CreateCustomRequestInput) =>
    apiFetch<CustomRequestDto>("/api/customrequests", { method: "POST", body: JSON.stringify(data) }, true),
  getAll: () => apiFetch<CustomRequestDto[]>("/api/customrequests", {}, true),
  quote: (id: string, quotedPrice: number, adminNote?: string) =>
    apiFetch<CustomRequestDto>(
      `/api/customrequests/${id}/quote`,
      { method: "PUT", body: JSON.stringify({ requestId: id, quotedPrice, adminNote }) },
      true
    ),
  confirm: (id: string) =>
    apiFetch<CustomRequestDto>(`/api/customrequests/${id}/confirm`, { method: "PUT" }),
  reject: (id: string, adminNote?: string) =>
    apiFetch<CustomRequestDto>(
      `/api/customrequests/${id}/reject`,
      { method: "PUT", body: JSON.stringify({ requestId: id, adminNote }) },
      true
    ),
};

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthResultDto>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (email: string, password: string, displayName: string, deviceHash?: string) =>
    apiFetch<AuthResultDto>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, displayName, deviceHash }),
    }),
  google: (data: { idToken?: string; email?: string; displayName?: string; photoUrl?: string; googleId?: string; deviceHash?: string }) =>
    apiFetch<AuthResultDto>("/api/auth/google", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  setGuestPassword: (data: { email: string; password: string; displayName?: string; deviceHash?: string }) =>
    apiFetch<AuthResultDto>("/api/auth/set-password-for-guest", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const creditsApi = {
  getPackages: () => apiFetch<CreditPackageDto[]>("/api/credits/packages"),
  createOrder: (packageId: string, currency: "VND" | "USD" = "VND", email?: string, userId?: string) =>
    apiFetch<{
      topupCode: string;
      package: CreditPackageDto;
      amount: number;
      currency: string;
      totalCredits: number;
      vietQr: {
        bankId: string;
        accountNo: string;
        accountName: string;
        qrUrl: string;
        description: string;
      };
    }>("/api/credits/order", {
      method: "POST",
      body: JSON.stringify({ packageId, currency, email, userId }),
    }, true),
  confirmTest: (userId: string, creditsToAdd: number) =>
    apiFetch<{ success: boolean; userId: string; newCredits: number; message: string }>("/api/credits/confirm-test", {
      method: "POST",
      body: JSON.stringify({ userId, creditsToAdd }),
    }),
};

export const adminUsersApi = {
  getAll: (search?: string, role?: string) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (role && role !== "all") params.append("role", role);
    return apiFetch<{
      total: number;
      users: AdminUserDto[];
      stats: {
        totalUsers: number;
        totalPro: number;
        totalAdmins: number;
        totalCreditsIssued: number;
      };
    }>(`/api/admin/users?${params.toString()}`, {}, true);
  },
  updateRole: (id: string, role: string, credits?: number) =>
    apiFetch<{ success: boolean; id: string; role: string; credits: number; message: string }>(
      `/api/admin/users/${id}/role`,
      {
        method: "PUT",
        body: JSON.stringify({ role, credits }),
      },
      true
    ),
};

export const uploadsApi = {
  getPresignedUrl: (fileName: string, contentType: string, folder: string) =>
    apiFetch<PresignedUploadResult>("/api/uploads/presigned-url", {
      method: "POST",
      body: JSON.stringify({ fileName, contentType, folder }),
    }),
};

export interface OrderPaymentStatusResponse {
  orderId: string;
  orderNumber: string;
  status: string;
  isPaid: boolean;
  total: number;
  note?: string;
  createdAt: string;
}

export const paymentsApi = {
  getOrderStatus: (idOrOrderNumber: string) =>
    apiFetch<OrderPaymentStatusResponse>(`/api/payments/order-status/${encodeURIComponent(idOrOrderNumber)}`),
  simulateCassoPayment: (idOrOrderNumber: string) =>
    apiFetch<{ success: boolean; message: string; orderNumber: string; status: string; transactionRef: string }>(
      `/api/payments/simulate-casso-payment/${encodeURIComponent(idOrOrderNumber)}`,
      { method: "POST" }
    ),
  testTelegram: (message?: string) =>
    apiFetch<{ sent: boolean; message: string }>("/api/payments/test-telegram", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
