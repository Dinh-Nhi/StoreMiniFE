import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerApi, login as loginApi } from "../../../helper/api";
import { useAuth } from "../../../context/AuthContext";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: loginAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   

    if (!userName || !password || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const res = await registerApi({ userName, password, email, fullName, phone, address });

      if (res.data?.code === 2000) {
        alert("Đăng ký thành công! Hệ thống đang đăng nhập...");

        const loginRes = await loginApi({ userName, password });

        if (loginRes.data?.code === 2000) {
          const token = loginRes.data.data;
          if (token) {
            localStorage.setItem("token", token);
            loginAuth(token);

            alert("Đăng nhập thành công!");
            navigate("/");
          } else {
            alert("Không nhận được token từ server!");
          }
        } else {
          alert(loginRes.data?.message || "Đăng nhập thất bại!");
        }
      } else {
        alert(res.data?.message || "Đăng ký thất bại!");
      }
    } catch (err: any) {
      console.error("Register error:", err);
      alert(err.response?.data?.message || "Có lỗi xảy ra khi đăng ký!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-1">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="bg-light p-5 rounded shadow">
            <h3 className="text-center mb-4 text-primary">Đăng ký</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="fullname" className="form-label fw-bold">Họ và tên</label>
                <input
                  type="text"
                  id="fullname"
                  className="form-control p-3"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="username" className="form-label fw-bold">Tên đăng nhập</label>
                <input
                  type="text"
                  id="username"
                  className="form-control p-3"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control p-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label fw-bold">Số điện thoại</label>
                <input
                  type="text"
                  id="phone"
                  className="form-control p-3"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label fw-bold">Địa chỉ</label>
                <input
                  type="text"
                  id="address"
                  className="form-control p-3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-bold">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  className="form-control p-3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-bold">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control p-3"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-3 rounded-pill"
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </form>
            <p className="text-center mt-3 mb-0">
              Đã có tài khoản?{" "}
              <a href="/login" className="text-primary fw-bold">Đăng nhập tại đây</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
