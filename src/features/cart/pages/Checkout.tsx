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
    paymentMethod: "COD" as "COD" | "BANK_TRANSFER",
  });

  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // 🔹 Load ảnh sản phẩm (chuẩn như Cart.tsx)
  useEffect(() => {
    if (!items || items.length === 0) return;

    const imageMap: Record<string, string> = {};
    const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

    for (const it of items) {
      const key = `${it.productId}-${it.variantId}-${it.sizeId}`;

      if (
        it.image?.startsWith("http") ||
        it.image?.startsWith("blob:") ||
        it.image?.includes("/img/")
      ) {
        imageMap[key] = it.image;
      } else if (it.image) {
        // ✅ Sử dụng API media chuẩn
        imageMap[key] = `${baseUrl}/media/viewFileKeyForProduct/${it.image}`;
      } else {
        imageMap[key] = "/img/placeholder.png";
      }
    }

    setImages(imageMap);
  }, [items]);

  const total = items.reduce((acc, it) => acc + it.price * it.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!items.length) {
      toast.warning("🛒 Giỏ hàng trống!");
      return;
    }

    try {
      const orderPayload: OrderRequest = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        paymentMethod: form.paymentMethod,
        items: items.map((it) => ({
          variantId: Number(it.variantId),
          quantity: it.quantity,
          color: it.color,
          size: it.size,
        })),
      };

      console.log(orderPayload)

      if (form.paymentMethod === "COD") {
        const orderRes = await orderService.createOrder(orderPayload);
        toast.success("🎉 Đặt hàng thành công!");
        dispatch(clearCart());
        navigate("/thankyou", { state: { order: orderRes } });
      } else {
        const res = await orderService.createOrderVnpay(orderPayload);
        const paymentUrl = res.paymentUrl;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          toast.error("❌ Không tạo được link VNPAY!");
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error("❌ Đặt hàng thất bại. Vui lòng thử lại!");
    }
  };

  if (!items.length) {
    return (
      <div
        className="container text-center"
        style={{
          background: "#f8f9fa",
          borderRadius: "12px",
          padding: "40px",
          marginTop: "120px",
        }}
      >
        <h3 className="fw-bold text-danger mb-3">Không có sản phẩm nào</h3>
        <p>Hãy thêm sản phẩm để bắt đầu mua sắm!</p>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: "900px" }}>
      <h2 className="fw-bold text-primary mb-4">Thanh toán</h2>

      <form onSubmit={handleSubmit} className="row g-4">
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
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
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
                  id="BANK_TRANSFER"
                  checked={form.paymentMethod === "BANK_TRANSFER"}
                  onChange={() =>
                    setForm({ ...form, paymentMethod: "BANK_TRANSFER" })
                  }
                />
                <label className="form-check-label" htmlFor="BANK_TRANSFER">
                  Chuyển khoản ngân hàng
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* TÓM TẮT ĐƠN HÀNG */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Tóm tắt đơn hàng</h5>

              {items.map((it) => {
                const key = `${it.productId}-${it.variantId}-${it.sizeId}`;
                const imgSrc = images[key] || "/img/placeholder.png";

                return (
                  <div
                    key={key}
                    className="d-flex align-items-center mb-3 border-bottom pb-2"
                  >
                    <img
                      src={imgSrc}
                      alt={it.name}
                      width={60}
                      height={60}
                      className="rounded"
                      style={{
                        objectFit: "cover",
                        marginRight: "10px",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/img/placeholder.png";
                      }}
                    />
                    <div className="flex-grow-1 text-start">
                      <div className="fw-semibold">{it.name}</div>
                      <small className="text-muted d-block">
                        Màu: {it.color || "—"} | Size: {it.size || "—"}
                      </small>
                      <div>
                        SL: {it.quantity} ×{" "}
                        {it.price.toLocaleString()}₫
                      </div>
                    </div>
                    <div className="fw-bold text-end" style={{ minWidth: 80 }}>
                      {(it.price * it.quantity).toLocaleString()}₫
                    </div>
                  </div>
                );
              })}

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
