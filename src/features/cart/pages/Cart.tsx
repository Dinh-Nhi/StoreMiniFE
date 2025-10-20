import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../../../store";
import {
  removeFromCart,
  clearCart,
  updateQuantity,
} from "../store/cartSlice";
import api from "../../../shared/utils/api";

export default function Cart() {
  const items = useSelector((s: RootState) => s.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const total = items.reduce((acc, it) => acc + it.price * it.quantity, 0);

  const handleCheckout = async () => {
    try {
      await api.post("/purchase", { items });
      alert("✅ Checkout thành công!");
      dispatch(clearCart());
    } catch (err) {
      console.error(err);
      alert("❌ Checkout thất bại. Kiểm tra backend.");
    }
  };

  // 👉 Nếu không có sản phẩm, hiển thị thông báo
  if (!items || items.length === 0) {
    return (
      <div
        className="container py-5 text-center"
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

  // 👉 Khi có sản phẩm
  return (
    <div className="container py-5">
      <h2 className="fw-bold text-primary mb-4">Giỏ hàng của bạn</h2>

      <div className="table-responsive" style={{padding : "inherit"}}>
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th></th>
              <th>Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Tổng</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>
                  <img
                    src={it.image}
                    alt={it.name}
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                    className="rounded"
                  />
                </td>
                <td className="fw-semibold">{it.name}</td>
                <td>{it.price.toLocaleString()}₫</td>
                <td>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: it.id,
                            quantity: it.quantity - 1,
                          })
                        )
                      }
                    >
                      -
                    </button>
                    <span className="px-3">{it.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: it.id,
                            quantity: it.quantity + 1,
                          })
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{(it.price * it.quantity).toLocaleString()}₫</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => dispatch(removeFromCart(it.id))}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4 className="fw-bold">Tổng cộng: {total.toLocaleString()}₫</h4>
        <button
          onClick={handleCheckout}
          className="btn btn-success px-4 py-2 rounded-pill"
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
}
