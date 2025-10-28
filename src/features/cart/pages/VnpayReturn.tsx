import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { orderService } from "../../../helper/api";

export default function VnpayReturn() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "fail">(
    "loading"
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const responseCode = params.get("vnp_ResponseCode");
    const orderId = params.get("vnp_TxnRef");
    console.log(responseCode);
    console.log(orderId);

    const handlePaymentStatus = async () => {
      try {
        if (responseCode === "00" && orderId) {
          // Gọi API cập nhật trạng thái đơn hàng
          await orderService.updateStatusOrder(orderId);
          setStatus("success");
        } else {
          setStatus("fail");
        }
      } catch (error) {
        console.error("❌ Lỗi khi cập nhật đơn hàng:", error);
        setStatus("fail");
      }
    };

    // Thêm delay 700ms để hiển thị animation loading
    const timer = setTimeout(() => {
      handlePaymentStatus();
    }, 700);

    return () => clearTimeout(timer);
  }, [location.search]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => navigate("/"), 5000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div
      className="d-flex justify-content-center align-items-center w-100"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right bottom, #f8fafc, #eef2ff)",
        paddingTop: "200px", // 👈 đẩy nội dung xuống thấp hơn header
        paddingBottom: "60px",
      }}
    >
      <div
        className="bg-white shadow-lg rounded-4 text-center p-5 position-relative"
        style={{
          maxWidth: "480px",
          width: "100%",
          border: "1px solid #f0f0f0",
        }}
      >
        {status === "loading" && (
          <>
            <Loader2
              className="animate-spin text-primary mx-auto mb-3"
              size={60}
            />
            <h4 className="fw-bold text-dark mb-2">Đang xử lý thanh toán...</h4>
            <p className="text-muted mb-0">
              Vui lòng chờ trong giây lát để xác nhận giao dịch.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <img
              src="https://cdn-icons-png.flaticon.com/512/148/148767.png"
              alt="Success"
              className="img-fluid mx-auto mb-3"
              style={{ width: "110px", height: "110px" }}
            />
            <h4 className="fw-bold text-success mb-2">
              Thanh toán thành công!
            </h4>
            <p className="text-secondary mb-3">
              Cảm ơn bạn đã mua sắm tại <strong>MINI STORE</strong> 💖 <br />
              Bạn sẽ được chuyển đến trang chủ trong vài giây...
            </p>

            <div className="progress" style={{ height: "6px" }}>
              <div
                className="progress-bar bg-success progress-bar-striped progress-bar-animated"
                style={{
                  width: "100%",
                  animation: "progressBar 5s linear forwards",
                }}
              ></div>
            </div>
          </>
        )}

        {status === "fail" && (
          <>
            <img
              src="https://cdn-icons-png.flaticon.com/512/463/463612.png"
              alt="Fail"
              className="img-fluid mx-auto mb-3"
              style={{ width: "110px", height: "110px" }}
            />
            <h4 className="fw-bold text-danger mb-2">Thanh toán thất bại!</h4>
            <p className="text-muted mb-3">
              Đã xảy ra lỗi trong quá trình thanh toán. <br />
              Vui lòng thử lại hoặc chọn phương thức khác.
            </p>
            <button
              onClick={() => navigate("/cart")}
              className="btn btn-danger px-4 py-2 rounded-pill"
            >
              Quay lại giỏ hàng
            </button>
          </>
        )}
      </div>

      {/* CSS animation cho progress */}
      <style>
        {`
          @keyframes progressBar {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}
      </style>
    </div>
  );
}
