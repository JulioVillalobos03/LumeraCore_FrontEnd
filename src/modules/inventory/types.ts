export interface InventoryItem {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  stock: number;
}

export interface InventoryMovement {
  id: string;
  product_id: string;
  movement_type: "in" | "out" | "adjustment";
  quantity: number;
  notes?: string;
  created_at: string;
  product_name?: string;
  created_by_name?: string;
}

export interface Product {
  id: string;
  name: string;
}
