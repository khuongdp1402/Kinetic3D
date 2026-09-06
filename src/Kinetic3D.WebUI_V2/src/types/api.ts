export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  isDeleted: boolean;
}

export interface ProductVariantDto {
  id: string;
  productId: string;
  price: number | null;
  attributes: Record<string, string>;
}

export interface CreateProductVariantInput {
  price: number | null;
  attributes: Record<string, string>;
}

export interface ProductDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  basePrice: number;
  imageUrl: string | null;
  images: string[];
  model3DUrl: string | null;
  specs: Record<string, string>;
  colors: string[];
  sizes: string[];
  featured: boolean;
  inStock: boolean;
  isDeleted: boolean;
  categoryId: string;
  category: CategoryDto | null;
  variants: ProductVariantDto[] | null;
}

export type CreateProductInput = Omit<Partial<ProductDto>, "variants" | "category" | "id" | "isDeleted"> & {
  variants?: CreateProductVariantInput[];
};

export interface OrderItemDto {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  variantAttributesSnapshot: string | null;
  customText: string | null;
}

export interface OrderDto {
  id: string;
  orderNumber: string;
  userId: string | null;
  customerEmail: string;
  customerPhone: string;
  shippingFullName: string;
  shippingAddress: string;
  shippingCity: string;
  note: string | null;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItemDto[];
}

export interface CreateOrderItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
  customText?: string;
}

export interface CreateOrderInput {
  customerEmail: string;
  customerPhone: string;
  shippingFullName: string;
  shippingAddress: string;
  shippingCity: string;
  note?: string;
  items: CreateOrderItemInput[];
}

export interface CustomRequestDto {
  id: string;
  userId: string | null;
  customerEmail: string | null;
  referenceImageUrl: string;
  sketchImageUrl: string | null;
  description: string;
  status: string;
  quotedPrice: number | null;
  adminNote: string | null;
  createdAt: string;
}

export interface CreateCustomRequestInput {
  customerEmail?: string;
  referenceImageUrl: string;
  sketchImageUrl?: string;
  description: string;
}

export interface AuthResultDto {
  userId: string;
  email: string;
  displayName: string;
  role: string;
  token: string;
  credits?: number;
}

export interface CreditPackageDto {
  id: string;
  name: string;
  credits: number;
  bonusCredits: number;
  priceVnd: number;
  priceUsd: number;
  badge: string;
  description: string;
  isPopular: boolean;
}

export interface AdminUserDto {
  id: string;
  email: string;
  displayName: string;
  role: string;
  credits: number;
  avatarUrl: string | null;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
}

export interface PresignedUploadResult {
  uploadUrl: string;
  publicUrl: string;
}

