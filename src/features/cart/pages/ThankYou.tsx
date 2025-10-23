import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "react-bootstrap";

export default function ThankYou() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!order) {
    return (
      <div className="container text-center py-5">
        <h2 className="text-danger fw-bold mb-3">Không tìm thấy đơn hàng!</h2>
        <p>Vui lòng quay lại trang chủ để tiếp tục mua sắm.</p>
        <Button variant="primary" onClick={() => navigate("/")}>
          Quay lại trang chủ
        </Button>
      </div>
    );
  }

  return (
    <div className="container text-center py-5">
      <div className="card shadow-sm border-0 p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <div className="mb-4" style={{ paddingTop: "90px" }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
            alt="Success"
            width="90"
            className="mb-3"
          />
          <h2 className="fw-bold text-success">Cảm ơn bạn đã đặt hàng!</h2>
          <p className="text-muted mb-4">
            Đơn hàng của bạn đã được tạo thành công. Chúng tôi sẽ liên hệ để xác nhận trong thời gian sớm nhất.
          </p>
        </div>

        <div className="border-top pt-3 text-start">
          <h5 className="fw-bold mb-3">Thông tin đơn hàng</h5>
          <p className="mb-1">
            <strong>Mã đơn hàng:</strong> #{order.id || order._id || "N/A"}
          </p>
          <p className="mb-1">
            <strong>Tên người nhận:</strong> {order.customerName}
          </p>
          <p className="mb-1">
            <strong>Số điện thoại:</strong> {order.phone}
          </p>
          <p className="mb-1">
            <strong>Địa chỉ:</strong> {order.address}
          </p>
          <p className="mb-1">
            <strong>Phương thức thanh toán:</strong>{" "}
            {order.paymentMethod === "COD"
              ? "Thanh toán khi nhận hàng (COD)"
              : "Chuyển khoản ngân hàng"}
          </p>

          <hr />

          <h6 className="fw-bold">Sản phẩm:</h6>
          {order.items?.map((it: any, i: number) => (
            <div
              key={i}
              className="d-flex justify-content-between small text-muted mb-1"
            >
              <span>
                {it.productName} × {it.quantity}
              </span>
              <span>
                {(Number(it.price) * Number(it.quantity)).toLocaleString()}₫
              </span>
            </div>
          ))}

          <hr />
          <h5 className="fw-bold d-flex justify-content-between">
            <span>Tổng cộng:</span>
            <span className="text-success">
              {order.totalPrice?.toLocaleString() || "0"}₫
            </span>
          </h5>
        </div>

        <div className="mt-4 d-flex justify-content-center gap-3"> 


          {/* Phần này cần kiểm tra lại xem dựa vào gì để xác nhận đơn hàng này có thể dùng username hay email hay gì */}
          {/* <Button variant="outline-primary" onClick={() => navigate("/orders")}>
            Xem đơn hàng của tôi
          </Button> */}
          <Button variant="success" onClick={() => navigate("/")}>
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    </div>
  );
}
