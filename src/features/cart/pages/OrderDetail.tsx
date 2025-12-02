import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "../../../helper/api";
import { Spinner, Badge } from "react-bootstrap";

interface OrderItem {
  variantId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  size: string;
  color: string;
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

// Map trạng thái đơn hàng
const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Chờ xử lý", color: "secondary" },
  PAYMENT: { label: "Đã thanh toán", color: "info" },
  SHIPPED: { label: "Đang vận chuyển", color: "primary" },
  CANCELLED: { label: "Đã hủy", color: "danger" },
};

// Map phương thức thanh toán
const paymentMethodMap: Record<string, { label: string; color: string }> = {
  COD: { label: "Thanh toán khi nhận hàng", color: "warning" },
  BANK_TRANSFER: { label: "Chuyển khoản ngân hàng", color: "success" },
};

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
    return (
      <p className="text-center text-danger py-5">Không tìm thấy đơn hàng.</p>
    );
  }

  const statusInfo = statusMap[order.status] || {
    label: order.status,
    color: "secondary",
  };

  const paymentInfo = paymentMethodMap[order.paymentMethod] || {
    label: order.paymentMethod,
    color: "secondary",
  };

  return (
    <div className="container" style={{ marginTop: "160px" }}>
      <h2 className="fw-bold mb-4 text-center">
        Chi tiết đơn hàng #{order.id}
      </h2>

      {/* Thông tin đơn hàng */}
      <div className="card p-4 shadow-sm rounded-4 mb-4">
        <h5 className="fw-bold mb-3">Thông tin đơn hàng</h5>
        <p>
          <b>Tên:</b> {order.name}
        </p>
        <p>
          <b>Số điện thoại:</b> {order.phone}
        </p>
        <p>
          <b>Địa chỉ:</b> {order.address}
        </p>
        <p>
          <b>Phương thức thanh toán:</b>{" "}
          <Badge bg={paymentInfo.color} className="px-2 py-1">
            {paymentInfo.label}
          </Badge>
        </p>
        <p>
          <b>Trạng thái:</b>{" "}
          <Badge bg={statusInfo.color} className="px-2 py-1">
            {statusInfo.label}
          </Badge>
        </p>
        <p>
          <b>Ngày đặt:</b> {new Date(order.createdAt).toLocaleString("vi-VN")}
        </p>
      </div>

      {/* Sản phẩm trong đơn */}
      <div className="card p-4 shadow-sm rounded-4">
        <h5 className="fw-bold mb-3">Sản phẩm trong đơn</h5>
        <table className="table table-bordered align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Kích thước</th>
              <th>Màu</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((it, idx) => (
              <tr key={idx}>
                <td className="text-start">{it.productName}</td>
                <td>{it.quantity ?? 0}</td>
                <td>{Number(it.price ?? 0).toLocaleString("vi-VN")}₫</td>
                <td className="text-start">{it.size}</td>
                <td className="text-start">{it.color}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-end mt-3">
          <h5>
            Tổng tiền:{" "}
            <span className="text-danger fw-bold">
              {Number(order.totalPrice ?? 0).toLocaleString("vi-VN")}₫
            </span>
          </h5>
        </div>
      </div>
    </div>
  );
}
