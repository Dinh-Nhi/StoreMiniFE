import axios from "axios";

const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_API,
});

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API,
});

export const getStoreInfo = () => userApi.get("/inforWeb");
export const getAllUsers = () => adminApi.get("/users");

export { userApi, adminApi };
