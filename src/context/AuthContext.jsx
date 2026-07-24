import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, setAccessToken } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ao carregar a página, tenta renovar a sessão a partir do cookie httpOnly de refresh
  // (o access token em si não é persistido — fica só em memória).
  useEffect(() => {
    let active = true;
    api
      .refreshSession()
      .then(({ accessToken, user }) => {
        if (!active) return;
        setAccessToken(accessToken);
        setUser(user);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const { user, accessToken } = await api.login({ email, password });
    setAccessToken(accessToken);
    setUser(user);
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { user, accessToken } = await api.register({ name, email, password });
    setAccessToken(accessToken);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    await api.logout().catch(() => {});
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
