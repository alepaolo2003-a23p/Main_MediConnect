import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Auth.scss";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmPassword: "",
    dni: "",
    telefono: "",
    fecha_nacimiento: "",
  });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.correo.trim()) newErrors.correo = "El correo es obligatorio";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Mínimo 6 caracteres";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        nombre: formData.nombre,
        correo: formData.correo,
        password: formData.password,
        dni: formData.dni,
        telefono: formData.telefono,
        fecha_nacimiento: formData.fecha_nacimiento || undefined,
      });
      setServerMessage({
        type: "success",
        text: "Cuenta creada correctamente. Ya puedes iniciar sesión como paciente.",
      });
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setServerMessage({ type: "error", text: err.message });
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
          <h1>Crea tu cuenta de paciente</h1>
          <p>Reserva citas, revisa tu historial médico y más.</p>
        </div>
      </div>

      <div className="auth-panel auth-panel--form">
        <div className="auth-box">
          <h2>Registrarse</h2>
          <p className="auth-box__subtitle">Los nuevos registros se crean como paciente</p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={errors.nombre ? "input-error" : ""}
                placeholder="María López"
              />
              {errors.nombre && <span className="field-error">{errors.nombre}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                className={errors.correo ? "input-error" : ""}
                placeholder="tucorreo@ejemplo.com"
              />
              {errors.correo && <span className="field-error">{errors.correo}</span>}
            </div>

            <div className="auth-field-row">
              <div className="auth-field">
                <label htmlFor="dni">DNI</label>
                <input id="dni" name="dni" value={formData.dni} onChange={handleChange} />
              </div>
              <div className="auth-field">
                <label htmlFor="telefono">Teléfono</label>
                <input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
              <input
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
                placeholder="••••••••"
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "input-error" : ""}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>

            {serverMessage && (
              <p className={`auth-form__message ${serverMessage.type}`}>{serverMessage.text}</p>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="auth-box__footer">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
