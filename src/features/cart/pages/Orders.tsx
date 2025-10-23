import { useEffect, useState } from "react";
import { orderService } from "../../../helper/api";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

interface Order {
  id: number;
  name: string;
  phone: string;
  address: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const phone = localStorage.getItem("phone"); // hoặc từ context user

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (phone) {
          const data = await orderService.getOrdersByPhone(phone);
          setOrders(data);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [phone]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ minHeight: "80vh" }}>
      <h2 className="fw-bold mb-4 text-center">Đơn hàng của tôi</h2>

      {orders.length === 0 ? (
        <p className="text-center text-muted">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm p-3 h-100 border-0 rounded-4">
                <div className="card-body">
                  <h5 className="fw-bold mb-2">Mã đơn #{order.id}</h5>
                  <p className="mb-1">
                    <b>Ngày đặt:</b>{" "}
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                  <p className="mb-1">
                    <b>Trạng thái:</b>{" "}
                    <span className="text-primary">{order.status}</span>
                  </p>
                  <p className="mb-2">
                    <b>Tổng tiền:</b>{" "}
                    {order.totalPrice.toLocaleString("vi-VN")}₫
                  </p>

                  <button
                    className="btn btn-outline-primary w-100 mt-2 rounded-3"
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
