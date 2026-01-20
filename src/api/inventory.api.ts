import type { InventoryMovement } from "../modules/inventory/types";
import {api} from "./axios";

export async function listInventory() {
  const { data } = await api.get("/inventory");
  return data.inventory;
}

export async function adjustInventory(payload: {
  product_id: string;
  quantity: number;
  type: "in" | "out";
  notes?: string;
}) {
  const { data } = await api.post("/inventory/adjust", payload);
  return data;
}

export async function listInventoryMovements() {
  const { data } = await api.get<{
    ok: boolean;
    movements: InventoryMovement[];
  }>("/inventory/movements");

  return data.movements;
}

export async function getProductStock(productId: string) {
  const { data } = await api.get(`/inventory/stock/${productId}`);
  return data.stock;
}

export async function getProductHistory(productId: string) {
  const { data } = await api.get(`/inventory/history/${productId}`);
  return data.movements;
}

export async function getInventoryById(id: string) {
  const { data } = await api.get<{
    ok: boolean;
    inventory: {
      id: string;
      stock: number;
      product: {
        id: string;
        name: string;
        sku: string;
        custom_fields?: Record<string, unknown>;
      };
    };
  }>(`/inventory/${id}`);

  return data.inventory;
}

export async function getInventoryHistory(productId: string) {
  const { data } = await api.get<{
    ok: boolean;
    movements: InventoryMovement[];
  }>(`/inventory/history/${productId}`);

  return data.movements;
}