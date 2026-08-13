import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const HOME_BY_ROLE = {
  administrador: "/admin",
  medico: "/medico",
  paciente: "/paciente",
};

/**
 * Protege una ruta exigiendo sesión activa y, opcionalmente, uno de los roles permitidos.
 * roles: array de roles válidos, p.ej. ["administrador"] o ["medico", "administrador"]
 */
export function ProtectedRoute({ roles, children }) {
  const { isAuthenticated, checkingSession, user } = useAuth();

  if (checkingSession) {
    return (
      <div className="loading-screen">
        <span className="spinner" />
        Cargando sesión...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.rol)) {
    return <Navigate to={HOME_BY_ROLE[user.rol] || "/login"} replace />;
  }

  return children;
}

export { HOME_BY_ROLE };
