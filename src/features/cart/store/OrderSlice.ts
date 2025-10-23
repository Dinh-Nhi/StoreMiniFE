// src/features/order/store/orderSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../../../helper/api";
import type { OrderRequest } from "../../../types/order";

interface OrderState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: OrderState = {
  loading: false,
  success: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (data: OrderRequest, { rejectWithValue }) => {
    try {
      const res = await orderService.createOrder(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Đặt hàng thất bại");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
