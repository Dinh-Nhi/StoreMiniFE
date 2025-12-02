import { useEffect, useState } from "react";
import { orderService } from "../../../helper/api";
import { useNavigate } from "react-router-dom";
import { Spinner, Badge, Table, Button } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";

interface Order {
  id: number;
  name: string;
  phone: string;
  address: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Chờ xử lý", color: "secondary" },
  PAYMENT: { label: "Đã thanh toán", color: "info" },
  SHIPPED: { label: "Đang vận chuyển", color: "primary" },
  CANCELLED: { label: "Đã hủy", color: "danger" },
};

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user || !user.fullName) return;

        const data = await orderService.getOrdersByName(user.fullName);
        setOrders(data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "160px" }}>
      <h2 className="fw-bold mb-4 text-center">Danh sách đơn hàng</h2>

      {orders.length === 0 ? (
        <p className="text-center text-muted">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#ID</th>
              <th>Ngày đặt</th>
              <th>Khách hàng</th>
              <th>Điện thoại</th>
              <th>Địa chỉ</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const statusInfo = statusMap[order.status] || {
                label: order.status,
                color: "secondary",
              };
              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td>{order.name}</td>
                  <td>{order.phone}</td>
                  <td>{order.address}</td>
                  <td>{order.totalPrice.toLocaleString("vi-VN")} ₫</td>
                  <td>
                    <Badge bg={statusInfo.color}>{statusInfo.label}</Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      Xem chi tiết
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
