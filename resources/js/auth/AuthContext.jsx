import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AuthCtx = createContext();

export function AuthProvider({ children }) {

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      setLoading(false);
      return;
    }

    api.defaults.headers.common.Authorization =
      `Bearer ${token}`;

    api.get("/admin/me")
      .then(res => setAdmin(res.data))
      .catch(() => {
        localStorage.removeItem("admin_token");
      })
      .finally(() => setLoading(false));

  }, []);

  const login = async (email, password) => {
    const res = await api.post("/admin/login", {
      email,
      password
    });

    localStorage.setItem("admin_token", res.data.token);

    api.defaults.headers.common.Authorization =
      `Bearer ${res.data.token}`;

    setAdmin(res.data.user);
  };

  const logout = async () => {
    await api.post("/admin/logout");
    localStorage.removeItem("admin_token");
    delete api.defaults.headers.common.Authorization;
    setAdmin(null);
  };

  return (
    <AuthCtx.Provider value={{
      admin,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
