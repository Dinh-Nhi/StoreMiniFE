import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../features/home/pages/Home";
import ProductDetail from "../features/products/pages/ProductDetail";
import Cart from "../features/cart/pages/Cart";
import Checkout from "../features/cart/pages/Checkout";
import Orders from "../features/cart/pages/Orders";
import OrderDetail from "../features/cart/pages/OrderDetail";
import ThankYou from "../features/cart/pages/ThankYou";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import VnpayReturn from "../features/cart/pages/VnpayReturn";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vnpay-return" element={<VnpayReturn />} />
        <Route path="/thankyou" element={<ThankYou />} />
      </Route>
    </Routes>
  );
}
