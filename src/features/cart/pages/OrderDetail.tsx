import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "../../../helper/api";
import { Spinner } from "react-bootstrap";

interface OrderItem {
  variantId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface OrderDetail {
  id: number;
  name: string;
  phone: string;
  address: string;
  paymentMethod: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (id) {
          const data = await orderService.getOrderById(Number(id));
          setOrder(data);
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!order) {
    return <p className="text-center text-danger py-5">Không tìm thấy đơn hàng.</p>;
  }

  return (
    <div className="container py-5" style={{ minHeight: "80vh" }}>
      <h2 className="fw-bold mb-4 text-center">Chi tiết đơn hàng #{order.id}</h2>

      <div className="card p-4 shadow-sm rounded-4 mb-4">
        <h5 className="fw-bold mb-3">Thông tin đơn hàng</h5>
        <p><b>Tên:</b> {order.name}</p>
        <p><b>Số điện thoại:</b> {order.phone}</p>
        <p><b>Địa chỉ:</b> {order.address}</p>
        <p><b>Phương thức thanh toán:</b> {order.paymentMethod}</p>
        <p><b>Trạng thái:</b> {order.status}</p>
        <p><b>Ngày đặt:</b> {new Date(order.createdAt).toLocaleString("vi-VN")}</p>
      </div>

      <div className="card p-4 shadow-sm rounded-4">
        <h5 className="fw-bold mb-3">Sản phẩm trong đơn</h5>
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Tạm tính</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((it, idx) => (
              <tr key={idx}>
                <td>{it.productName}</td>
                <td>{it.quantity}</td>
                <td>{it.price.toLocaleString("vi-VN")}₫</td>
                <td>{it.subtotal.toLocaleString("vi-VN")}₫</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-end mt-3">
          <h5>
            Tổng tiền:{" "}
            <span className="text-danger fw-bold">
              {order.totalPrice.toLocaleString("vi-VN")}₫
            </span>
          </h5>
        </div>
      </div>
    </div>
  );
}
