import axios from "axios";
import type { OrderRequest } from "../types/order";
// --- Tạo các instance axios ---
const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_API,
});

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API,
});

const api = axios.create({
  baseURL: import.meta.env.VITE_API,
});

// --- Thêm interceptor để tự động gắn token ---
[userApi, adminApi].forEach((instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
});

// --- Các API ---
export const getStoreInfo = () => userApi.get("/inforWeb");
export const getAllUsers = () => adminApi.get("/users");

export const login = (data: { userName: string; password: string }) =>
  userApi.post("/auth/login", data);

export const register = (data: {
  userName: string;
  password: string;
  email?: string;
  fullName?: string;
  phone?: string;
  address?: string;
}) => userApi.post("/auth/register", data);

export const getUserProducts = () => userApi.get("/products");
export const getUserProductById = (id: string) =>
  userApi.get(`/products/${id}`);
export const getCategoryByIsShow = () => userApi.get(`/categories/getByIsShow`);
export const getProductByCategoryId = (id: number) =>
  userApi.get(`/products/category/${id}`);

export const getBestSellingProducts = (limit = 10) =>
  userApi.get(`/products/best-selling?limit=${limit}`);

export const getDiscountedProducts = async () => {
  const res = await userApi.get("/products/discounted");
  return res.data;
};

// 🧾 --- ORDER SERVICE ---
export const orderService = {
  /** 🟢 Tạo đơn hàng (checkout) */
  createOrder: async (data: OrderRequest) => {
    const res = await userApi.post("/orders", data);
    return res.data;
  },

  createOrderVnpay: async (data: OrderRequest) => {
    const res = await userApi.post("/orders/payment", data);
    return res.data;
  },

  updateStatusOrder: async (id: string) => {
    const res = await userApi.post("/orders/updateStatus", { orderId: id });
    return res.data;
  },

  /** 🔵 Lấy danh sách đơn hàng của người dùng (theo phone hoặc userId) */
  getOrdersByPhone: async (phone: string) => {
    const res = await userApi.get(`/orders?phone=${phone}`);
    return res.data;
  },

  /** 🟣 Lấy chi tiết đơn hàng theo ID */
  getOrderById: async (id: number) => {
    const res = await userApi.get(`/orders/${id}`);
    return res.data;
  },
};

export const getMediaByFileKey = (filekey: string) =>
  api.get(`/media/viewFileKey/${filekey}`, {
    responseType: "blob",
  });

export { userApi, adminApi };
