export type ProductCategory = "Bolos" | "Tortas" | "Empadões";

export type DeliveryMethod = "entrega" | "retirada";

export type PaymentMethod = "pix" | "cartao" | "dinheiro";

export type OrderStatus =
  | "em_producao"
  | "saiu_entrega"
  | "pronto_retirada"
  | "entregue"
  | "cancelado";

export type CashEntryType = "in" | "out";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  size_label: string;
  price_cents: number;
  cost_cents: number;
  stock: number;
  active: boolean;
  tags: string[];
  swatch: string[];
  image_url: string | null;
  gallery_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  qty: number;
  unit_price_cents: number;
  product_snapshot: {
    name: string;
    size_label: string;
    category: ProductCategory;
  };
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_method: DeliveryMethod;
  bairro: string | null;
  address: string | null;
  cep: string | null;
  payment_method: PaymentMethod;
  status: OrderStatus;
  subtotal_cents: number;
  fee_cents: number;
  total_cents: number;
  notes: string | null;
  items: OrderItemSnapshot[];
  created_at: string;
}

export interface OrderItemSnapshot {
  product_id: string;
  name: string;
  qty: number;
  unit_price_cents: number;
}

export interface CashEntry {
  id: string;
  type: CashEntryType;
  category: string;
  description: string;
  amount_cents: number;
  order_id: string | null;
  created_at: string;
}

export interface Neighborhood {
  id: number;
  name: string;
  fee_cents: number;
  km: number;
  active: boolean;
}

export interface CartItem {
  product: Product;
  qty: number;
}
