import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { HOME_BY_ROLE } from "../../components/ProtectedRoute";
import "./Auth.scss";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const usuario = await login(correo, password);
      navigate(HOME_BY_ROLE[usuario.rol] || "/login", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel auth-panel--brand">
        <div className="auth-panel__content">
          <div className="auth-panel__logo">
            <span>+</span> MediConnect
          </div>
          <h1>Tu salud es nuestra prioridad</h1>
          <p>
            Accede a tu panel para gestionar citas, pacientes y clínicas desde
            un solo lugar.
          </p>
        </div>
      </div>

      <div className="auth-panel auth-panel--form">
        <div className="auth-box">
          <h2>Iniciar sesión</h2>
          <p className="auth-box__subtitle">Bienvenido, ingresa tus credenciales</p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="admin@mediconnect.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Contraseña</label>
              <div className="auth-field__password">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-field__toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="auth-form__options">
              <a href="#!">¿Olvidaste tu contraseña?</a>
            </div>

            {error && <p className="auth-form__message error">{error}</p>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="auth-box__footer">
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>

          <div className="auth-box__hint">
            <strong>Cuentas de prueba</strong>
            <span>admin@mediconnect.com / admin123</span>
            <span>carlos.ramirez@mediconnect.com / medico123</span>
            <span>juan.perez@example.com / paciente123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
