import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { NAV_BY_ROLE } from "./navConfig";
import "./DashboardLayout.scss";

const ROLE_LABEL = {
  administrador: "Administrador",
  medico: "Médico",
  paciente: "Paciente",
};

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nav = NAV_BY_ROLE[user?.rol] || { title: "Panel", items: [] };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = (user?.nombre || "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar__brand">
          <span className="dashboard-sidebar__logo-mark">+</span>
          <div>
            <strong>MediConnect</strong>
            <small>Cuidamos de ti y tu familia</small>
          </div>
        </div>

        <nav className="dashboard-sidebar__nav">
          {nav.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? "dash-link dash-link--active" : "dash-link"
              }
            >
              <span className="dash-link__icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button className="dashboard-sidebar__logout" onClick={handleLogout}>
          <span>🚪</span> Cerrar sesión
        </button>
      </aside>

      <div className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>{nav.title}</h1>
            <p>Resumen de tu actividad</p>
          </div>
          <div className="dashboard-header__user">
            <div className="dashboard-header__avatar">{initials}</div>
            <div>
              <strong>{user?.nombre}</strong>
              <span>{ROLE_LABEL[user?.rol] || user?.rol}</span>
            </div>
          </div>
        </header>

        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
