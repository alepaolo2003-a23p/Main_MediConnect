import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { loginRequest, registerRequest } from "../services/authService";
import { getMeRequest } from "../services/usersService";

function getStoredUser() {
  try {
    const raw = localStorage.getItem("mc_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
  const [checkingSession, setCheckingSession] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("mc_user");
  }, []);

  useEffect(() => {
    async function recoverSession() {
      const storedAccess = localStorage.getItem("accessToken");
      if (!storedAccess) {
        setCheckingSession(false);
        return;
      }

      // El accessToken solo trae user_id, así que confirmamos identidad
      // y rol vigentes contra /user/me (apiFetch ya intenta refresh si expiró).
      try {
        const me = await getMeRequest();
        const normalized = {
          _id: me._id,
          nombre: me.nombre,
          correo: me.correo,
          rol: me.rol,
          foto: me.foto,
          especialidad: me.especialidad,
          clinica_id: me.clinica_id,
        };
        setUser(normalized);
        localStorage.setItem("mc_user", JSON.stringify(normalized));
        setAccessToken(localStorage.getItem("accessToken"));
      } catch {
        logout();
      } finally {
        setCheckingSession(false);
      }
    }

    recoverSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (correo, password) => {
    const data = await loginRequest(correo, password);

    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    localStorage.setItem("mc_user", JSON.stringify(data.usuario));

    setUser(data.usuario);
    setAccessToken(data.access);

    return data.usuario;
  };

  const register = async (formValues) => {
    return registerRequest(formValues);
  };

  const value = {
    user,
    accessToken,
    isAuthenticated: !!accessToken && !!user,
    checkingSession,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
