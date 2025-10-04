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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          required
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          required
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
