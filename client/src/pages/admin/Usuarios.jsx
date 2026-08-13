import { useEffect, useState } from "react";
import { getUsersRequest, deleteUserRequest, createUserRequest } from "../../services/usersService";
import "../dashboard-shared.scss";
import "./CrudPage.scss";

const emptyForm = { nombre: "", correo: "", password: "", rol: "paciente" };

export function Usuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsersRequest();
      setUsers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = filter === "all" ? users : users.filter((u) => u.rol === filter);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createUserRequest(formData);
      setFormData(emptyForm);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await deleteUserRequest(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="crud-toolbar">
        <h2 className="section-title">Usuarios ({users.length})</h2>
        <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancelar" : "+ Nuevo usuario"}
        </button>
      </div>

      <div className="filter-bar">
        {["all", "administrador", "medico", "paciente"].map((r) => (
          <button key={r} className={filter === r ? "active" : ""} onClick={() => setFilter(r)}>
            {r === "all" ? "Todos" : r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      {error && <p className="error-state">{error}</p>}

      {showForm && (
        <form className="crud-form" onSubmit={handleSubmit}>
          <div className="crud-form__grid">
            <div className="crud-field">
              <label>Nombre</label>
              <input name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className="crud-field">
              <label>Correo</label>
              <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
            </div>
            <div className="crud-field">
              <label>Contraseña</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="crud-field">
              <label>Rol</label>
              <select name="rol" value={formData.rol} onChange={handleChange}>
                <option value="paciente">Paciente</option>
                <option value="medico">Médico</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar usuario"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="empty-state">Cargando usuarios...</p>
      ) : filtered.length === 0 ? (
        <p className="empty-state">No se encontraron usuarios.</p>
      ) : (
        <div className="panel-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td>{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td style={{ textTransform: "capitalize" }}>{u.rol}</td>
                  <td>{u.activo ? "Activo" : "Inactivo"}</td>
                  <td>
                    <button className="link" onClick={() => handleDelete(u._id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
