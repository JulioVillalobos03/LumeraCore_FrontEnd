import { api } from "./axios";
import type { Product, CreateProductInput } from "../modules/products/types";

export async function listProducts(): Promise<Product[]> {
  const { data } = await api.get<{ ok: boolean; data: Product[] }>("/products");
  return data.data;
}

export async function getProduct(id: string): Promise<Product> {
  const { data } = await api.get<{ ok: boolean; data: Product }>(
    `/products/${id}`
  );
  return data.data;
}

export async function createProduct(payload: CreateProductInput) {
  console.log("🚀 API createProduct payload:", payload);

  const { data } = await api.post<{
    ok: boolean;
    data: { id: string };
  }>("/products", payload);

  return data.data;
}
export async function updateProduct(id: string, payload: CreateProductInput) {
  const { data } = await api.put(`/products/${id}`, payload);
  return data;
}

export async function changeProductStatus(
  id: string,
  status: "active" | "inactive"
) {
  const { data } = await api.patch(`/products/${id}/status`, { status });
  return data;
}
