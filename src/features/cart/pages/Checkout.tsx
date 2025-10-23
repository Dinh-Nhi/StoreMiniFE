import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../../../store";
import { clearCart } from "../../cart/store/cartSlice";
import { orderService } from "../../../helper/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { OrderRequest } from "../../../types/order";

export default function Checkout() {
  const items = useSelector((s: RootState) => s.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "COD" as "COD" | "BANK",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const total = items.reduce((acc, it) => acc + it.price * it.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!items.length) {
      toast.warning("🛒 Giỏ hàng trống!");
      return;
    }

    try {
      // ✅ Chuẩn hóa payload theo type OrderRequest
      const orderPayload: OrderRequest = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        paymentMethod: form.paymentMethod,
        items: items.map((it) => ({
          variantId: Number(it.variantId || it.id),
          quantity: it.quantity,
        })),
      };

      // ✅ Gọi API tạo đơn hàng
      const orderRes = await orderService.createOrder(orderPayload);

      toast.success("🎉 Đặt hàng thành công!");
      dispatch(clearCart());
      navigate("/thankyou", { state: { order: orderRes } });
    } catch (err: any) {
      console.error(err);
      toast.error("❌ Đặt hàng thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "900px" }}>
      <h2 className="fw-bold text-primary mb-4">Thanh toán</h2>

      <form onSubmit={handleSubmit} className="row g-4" style={{ padding: "inherit" }}>
        {/* THÔNG TIN GIAO HÀNG */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Thông tin giao hàng</h5>

              <div className="mb-3">
                <label className="form-label">Họ và tên</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Địa chỉ giao hàng</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* HÌNH THỨC THANH TOÁN */}
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Hình thức thanh toán</h5>

              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment"
                  id="cod"
                  checked={form.paymentMethod === "COD"}
                  onChange={() => setForm({ ...form, paymentMethod: "COD" })}
                />
                <label className="form-check-label" htmlFor="cod">
                  Thanh toán khi nhận hàng (COD)
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment"
                  id="bank"
                  checked={form.paymentMethod === "BANK"}
                  onChange={() => setForm({ ...form, paymentMethod: "BANK" })}
                />
                <label className="form-check-label" htmlFor="bank">
                  Chuyển khoản ngân hàng
                </label>
              </div>

              {form.paymentMethod === "BANK" && (
                <div className="mt-3 p-3 border rounded bg-light">
                  <h6 className="fw-bold mb-2">Thông tin chuyển khoản</h6>
                  <p className="mb-0">Ngân hàng: <b>Vietcombank</b></p>
                  <p className="mb-0">Số tài khoản: <b>0123456789</b></p>
                  <p className="mb-0">Chủ TK: Nguyễn Văn A</p>
                  <p className="small text-muted mt-2">
                    Ghi nội dung: “Thanh toán đơn hàng #{Math.floor(Math.random() * 10000)}”
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TÓM TẮT ĐƠN HÀNG */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Tóm tắt đơn hàng</h5>

              {items.map((it) => (
                <div
                  key={it.id}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <span>{it.name} × {it.quantity}</span>
                  <span>{(it.price * it.quantity).toLocaleString()}₫</span>
                </div>
              ))}

              <hr />
              <h5 className="fw-bold d-flex justify-content-between">
                <span>Tổng cộng:</span>
                <span className="text-success">{total.toLocaleString()}₫</span>
              </h5>

              <button
                type="submit"
                className="btn btn-success w-100 mt-3 py-2 rounded-pill"
              >
                Xác nhận đặt hàng
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
