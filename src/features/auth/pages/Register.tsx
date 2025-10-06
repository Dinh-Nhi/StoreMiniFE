// src/features/auth/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../shared/utils/api";

export default function Register() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");   
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();   

  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { email, password });
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
          <h3 className="text-center mb-4 text-primary">Đăng ký</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="fullname" className="form-label fw-bold">Họ và tên</label>
              <input type="text" id="fullname" className="form-control p-3" placeholder="Nhập họ và tên" required />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-bold">Tên đăng nhập</label>
              <input type="username" id="username" className="form-control p-3" placeholder="Nhập tên đăng nhập" required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">Email</label>
              <input type="email" id="email" className="form-control p-3" placeholder="Nhập email" required />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label fw-bold">Số điện thoại</label>
              <input type="phone" id="phone" className="form-control p-3" placeholder="Nhập số điện thoại" required />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label fw-bold">Địa chỉ</label>
              <input type="address" id="address" className="form-control p-3" placeholder="Nhập địa chỉ" required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">Mật khẩu</label>
              <input type="password" id="password" className="form-control p-3" placeholder="Nhập mật khẩu" required />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label fw-bold">Xác nhận mật khẩu</label>
              <input type="password" id="confirmPassword" className="form-control p-3" placeholder="Nhập lại mật khẩu" required />
            </div>
            {/* <div className="d-flex justify-content-between mb-3">
              <div>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember"> Ghi nhớ tôi</label>
              </div>
            </div> */}
            <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill">Đăng ký</button>
          </form>
          <p className="text-center mt-3 mb-0">Đã có tài khoản?
            <a href="login" className="text-primary fw-bold">Đăng nhập tại đây</a>
          </p>
        </div>  
      </div>
    </div>
  </div>
  );
}
