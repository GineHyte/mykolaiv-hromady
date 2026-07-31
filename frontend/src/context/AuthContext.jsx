import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi.js";
import { clearToken, getToken, setToken } from "../utils/authToken.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }
    authApi
      .me(token)
      .then(({ user }) => setUser(user))
      .catch(() => {
        clearToken();
        setTokenState(null);
        setUser(null);
      })
      .finally(() => setChecking(false));
  }, [token]);

  const login = useCallback(async (username, password) => {
    const { token, user } = await authApi.login(username, password);
    setToken(token);
    setTokenState(token);
    setUser(user);
  }, []);

  const register = useCallback(async (email, password) => {
    const { token, user } = await authApi.register(email, password);
    setToken(token);
    setTokenState(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    setUser(null);
  }, []);

  const value = {
    user,
    isAdmin: !!user,
    isSuperAdmin: user?.role === "admin",
    checking,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
