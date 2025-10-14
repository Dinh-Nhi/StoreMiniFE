import axios from "axios";

// --- Tạo các instance axios ---
const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_API,
});

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API,
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

export const getUserProducts = () => userApi.get("/user/products");
export const getUserProductById = (id: string) => userApi.get(`/user/products/${id}`);
export const getCategoryByIsShow = () => userApi.get(`/user/categories/getByIsShow`);
export const getProductByCategoryId = (id: number) => userApi.get(`/user//category/${id}`);

export { userApi, adminApi };
