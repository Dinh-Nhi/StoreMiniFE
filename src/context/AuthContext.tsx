// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  fullName?: string;
  userName?: string;
  email?: string;
  [key: string]: any;
}

interface AuthContextProps {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 🟦 Giải mã token mỗi khi load trang
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) decodeAndSetUser(token);
  }, []);

  const decodeAndSetUser = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        // fullName: payload.fullName,
        userName: payload.userName,
        email: payload.email,
      });
    } catch {
      setUser(null);
      localStorage.removeItem("token");
    }
  };

  const login = (token: string) => {
    localStorage.setItem("token", token);
    decodeAndSetUser(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
