// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../features/home/pages/Home";
import ProductList from "../features/products/pages/ProductList";
import ProductDetail from "../features/products/pages/ProductDetail";
import Cart from "../features/cart/pages/Cart";
import Login from "../features/auth/pages/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}
