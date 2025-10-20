// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../features/home/pages/Home";
import ProductList from "../features/products/pages/ProductList";
import ProductDetail from "../features/products/pages/ProductDetail";
import Cart from "../features/cart/pages/Cart";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
// import { ProductProvider } from "../context/ProductContext";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            // <ProductProvider>
              <Home />
            // </ProductProvider>
          }
        />
        {/* <Route
          path="/products"
          element={
            <ProductProvider>
              <ProductList />
            </ProductProvider>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProductProvider>
              <ProductDetail />
            </ProductProvider>
          }
        /> */}

        {/* 🔹 Các route khác không cần ProductContext */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}
