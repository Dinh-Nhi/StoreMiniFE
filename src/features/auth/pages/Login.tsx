import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../helper/api";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: loginAuth } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      const res = await login({ userName, password });

      if (res.data.code !== 2000) {
        alert(res.data.message);
        return;
      }

      // ✅ Token trả về từ backend nằm trong res.data.data
      const token = res.data?.data ?? null;

      if (token) {
        loginAuth(token);

        alert("Đăng nhập thành công!");
        navigate("/");
      } else {
        alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      alert(err?.response?.data?.message ?? "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="bg-light p-5 rounded shadow">
            <h3 className="text-center mb-4 text-primary">Đăng nhập</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="userName" className="form-label fw-bold">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  id="userName"
                  className="form-control p-3"
                  placeholder="Nhập tên đăng nhập"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-bold">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control p-3"
                  placeholder="Nhập mật khẩu"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-between mb-3">
                <a href="#" className="text-primary">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-3 rounded-pill"
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <p className="text-center mt-3 mb-0">
              Không có tài khoản?
              <a href="/register" className="text-primary fw-bold ms-1">
                Đăng ký tại đây
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
