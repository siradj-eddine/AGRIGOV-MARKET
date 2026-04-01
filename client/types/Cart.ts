// ─── Raw API shapes ───────────────────────────────────────────────────────────

/** Farm shape as returned inside cart items (different serializer from product list) */
export interface CartFarm {
  id:         number;
  name:       string;   // NOTE: cart uses "name", product list uses "farm_name"
  wilaya:     string;
  baladiya:   string;
  farm_size:  number;
  address:    string;   // NOTE: cart uses lowercase "address", product uses "Address"
  created_at: string;
  farmer:     number;   // FK id only
}

/** Product shape as embedded inside a cart item */
export interface CartProduct {
  id:             number;
  title:          string;
  farm:           CartFarm;
  farmer_name:    string;
  description:    string;
  season:         string;
  unit_price:     string;   // decimal string
  stock:          number;
  in_stock:       boolean;
  category:       string;   // plain string slug in cart (e.g. "fruits")
  images:         { id: number; image: string }[];
  average_rating: number;
  review_count:   number;
  created_at:     string;
}

/** One line in the cart */
export interface CartItem {
  id:          number;
  product:     CartProduct;
  quantity:    number;
  price:       string;      // unit price at time of adding
  total_price: number;
}

/** Full cart response from GET /api/cart/ */
export interface CartResponse {
  id:          number;
  buyer:       number;
  items:       CartItem[];
  total_items: number;
  total_price: number;
  farms:       string[];    // array of farm id strings
}

// ─── API request bodies ───────────────────────────────────────────────────────

export interface AddItemRequest {
  product_id: number;
  quantity:   number;
}

export interface UpdateQuantityRequest {
  product_id:  number;
  quantity: number;
}

export interface RemoveItemRequest {
  item_id: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Platform levy rate applied on subtotal */
export const LEVY_RATE = 0.01;

/** Flat shipping cost in DZD — replace with real logistics calc when available */
export const SHIPPING_FLAT = 2_500;