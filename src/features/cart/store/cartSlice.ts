import { createSlice } from "@reduxjs/toolkit";
import type {  PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  productId: number;
  name: string;
  image: string;
  color: string;
  variantId: number;
  size: string;
  sizeId: number;
  price: number;
  quantity: number;
  maxStock: number;
  availableColors: {
    id: number;
    color: string;
    sizes: { id: number; size: string; stock: number }[];
    price: number;
  }[];
  availableSizes: { id: number; size: string; stock: number }[];
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
};

// ✅ Lưu lại vào localStorage
const saveToStorage = (items: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 🔹 Thêm vào giỏ hàng
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existing = state.items.find(
        (i) =>
          i.productId === newItem.productId &&
          i.variantId === newItem.variantId &&
          i.sizeId === newItem.sizeId
      );

      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + newItem.quantity,
          existing.maxStock
        );
      } else {
        state.items.push(newItem);
      }

      saveToStorage(state.items);
    },

    // 🔹 Cập nhật số lượng
    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: number;
        variantId: number;
        sizeId: number;
        quantity: number;
      }>
    ) => {
      const { productId, variantId, sizeId, quantity } = action.payload;
      const item = state.items.find(
        (i) =>
          i.productId === productId &&
          i.variantId === variantId &&
          i.sizeId === sizeId
      );
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.maxStock));
      }
      saveToStorage(state.items);
    },

    // 🔹 Cập nhật biến thể (màu hoặc size)
    updateVariant: (
      state,
      action: PayloadAction<{
        productId: number;
        oldVariantId: number;
        oldSizeId: number;
        newColor?: string;
        newSize?: string;
      }>
    ) => {
      const { productId, oldVariantId, oldSizeId, newColor, newSize } =
        action.payload;

      const itemIndex = state.items.findIndex(
        (i) =>
          i.productId === productId &&
          i.variantId === oldVariantId &&
          i.sizeId === oldSizeId
      );

      if (itemIndex === -1) return;
      const item = state.items[itemIndex];

      let updatedItem = { ...item };

      // 🔸 Nếu đổi màu → lấy variant mới
      if (newColor) {
        const newVariant = item.availableColors.find(
          (v) => v.color === newColor
        );
        if (newVariant) {
          updatedItem.color = newVariant.color;
          updatedItem.variantId = newVariant.id;
          updatedItem.price = newVariant.price;
          updatedItem.availableSizes = newVariant.sizes;
          // đặt lại size mặc định (size đầu tiên)
          const firstSize = newVariant.sizes[0];
          updatedItem.size = firstSize.size;
          updatedItem.sizeId = firstSize.id;
          updatedItem.maxStock = firstSize.stock;
          updatedItem.quantity = Math.min(
            updatedItem.quantity,
            updatedItem.maxStock
          );
        }
      }

      // 🔸 Nếu đổi size → cập nhật lại size
      if (newSize) {
        const variant = item.availableColors.find(
          (v) => v.color === item.color
        );
        const sizeObj = variant?.sizes.find((s) => s.size === newSize);
        if (sizeObj) {
          updatedItem.size = sizeObj.size;
          updatedItem.sizeId = sizeObj.id;
          updatedItem.maxStock = sizeObj.stock;
          updatedItem.quantity = Math.min(
            updatedItem.quantity,
            updatedItem.maxStock
          );
        }
      }

      // Cập nhật lại item
      state.items[itemIndex] = updatedItem;
      saveToStorage(state.items);
    },

    // 🔹 Xóa item
    removeFromCart: (
      state,
      action: PayloadAction<{
        productId: number;
        variantId: number;
        sizeId: number;
      }>
    ) => {
      state.items = state.items.filter(
        (i) =>
          !(
            i.productId === action.payload.productId &&
            i.variantId === action.payload.variantId &&
            i.sizeId === action.payload.sizeId
          )
      );
      saveToStorage(state.items);
    },

    // 🔹 Xóa toàn bộ
    clearCart: (state) => {
      state.items = [];
      saveToStorage(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  updateVariant,
} = cartSlice.actions;

export default cartSlice.reducer;
