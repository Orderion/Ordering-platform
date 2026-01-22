import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Check session on first load
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ SAFE AUTH CHECK (401 WILL NOT CRASH APP)
  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/me");

      if (response?.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      // ✅ 401 = NOT LOGGED IN (EXPECTED)
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔐 GitHub OAuth Login
  const login = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {/* ⛔ DO NOT RENDER APP UNTIL AUTH CHECK IS DONE */}
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
