// src/features/auth/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../shared/utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      // backend nên trả { accessToken, user }
      const token = res.data?.accessToken ?? res.data?.token ?? null;
      if (token) {
        localStorage.setItem("token", token);
        // nếu muốn config axios để gửi token tự động, add interceptor nơi api.ts
        alert("Đăng nhập thành công");
        navigate("/");
      } else {
        alert("Login failed: no token returned");
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-1">
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="bg-light p-5 rounded shadow">
          <h3 className="text-center mb-4 text-primary">Đăng nhập</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">Tên đăng nhập</label>
              <input type="email" id="email" className="form-control p-3" placeholder="Nhập tên đăng nhập" required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">Mật khẩu</label>
              <input type="password" id="password" className="form-control p-3" placeholder="Nhập mật khẩu" required />
            </div>
            <div className="d-flex justify-content-between mb-3">
              {/* <div>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember"> Ghi nhớ tôi</label>
              </div> */}
              <a href="#" className="text-primary">Quên mật khẩu?</a>
            </div>
            <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill">Đăng nhập</button>
          </form>
          <p className="text-center mt-3 mb-0">Không có tài khoản?
            <a href="register" className="text-primary fw-bold">Đăng ký tại đây</a>
          </p>
        </div>
      </div>
    </div>
  </div>
  );
}
