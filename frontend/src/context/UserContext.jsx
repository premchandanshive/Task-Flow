import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await api.get("/me");
      setUser(response.data.user);
      return response.data.user;
    } catch {
      setUser(null);
      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const signup = async (formData) => {
    const response = await api.post("/signup", formData);
    setUser(response.data.user);
    return response.data;
  };

  const login = async (credentials) => {
    const response = await api.post("/login", credentials);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({ user, authLoading, signup, login, logout, refreshUser }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside UserProvider.");
  }

  return context;
}
