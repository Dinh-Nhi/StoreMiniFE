import { createSlice } from "@reduxjs/toolkit";

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variantId?: number | string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
};

const saveToLocal = (items: CartItem[]) => {
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch (e) {
    console.warn("localStorage error", e);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const payload: CartItem = action.payload;
      const existing = state.items.find((i) => i.id === payload.id);
      if (existing) {
        existing.quantity += payload.quantity;
      } else {
        state.items.push({ ...payload });
      }
      saveToLocal(state.items);
    },
    removeFromCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
      saveToLocal(state.items);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.quantity = Math.max(1, quantity);
      saveToLocal(state.items);
    },
    clearCart(state) {
      state.items = [];
      saveToLocal(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
