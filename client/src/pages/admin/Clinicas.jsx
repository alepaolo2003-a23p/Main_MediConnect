import { useEffect, useState } from "react";
import {
  getClinicasRequest,
  createClinicaRequest,
  deleteClinicaRequest,
} from "../../services/clinicasService";
import "../dashboard-shared.scss";
import "./CrudPage.scss";

const emptyForm = { nombre: "", direccion: "", telefono: "", correo: "" };

export function Clinicas() {
  const [clinicas, setClinicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClinicasRequest();
      setClinicas(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createClinicaRequest(formData);
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
    if (!confirm("¿Eliminar esta clínica?")) return;
    try {
      await deleteClinicaRequest(id);
      setClinicas((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="crud-toolbar">
        <h2 className="section-title">Clínicas ({clinicas.length})</h2>
        <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancelar" : "+ Nueva clínica"}
        </button>
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
              <label>Dirección</label>
              <input name="direccion" value={formData.direccion} onChange={handleChange} />
            </div>
            <div className="crud-field">
              <label>Teléfono</label>
              <input name="telefono" value={formData.telefono} onChange={handleChange} />
            </div>
            <div className="crud-field">
              <label>Correo</label>
              <input name="correo" value={formData.correo} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar clínica"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="empty-state">Cargando clínicas...</p>
      ) : clinicas.length === 0 ? (
        <p className="empty-state">No hay clínicas registradas.</p>
      ) : (
        <div className="panel-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clinicas.map((c) => (
                <tr key={c._id}>
                  <td>{c.nombre}</td>
                  <td>{c.direccion || "—"}</td>
                  <td>{c.telefono || "—"}</td>
                  <td>{c.correo || "—"}</td>
                  <td>{c.activo ? "Activa" : "Inactiva"}</td>
                  <td>
                    <button className="link" onClick={() => handleDelete(c._id)}>
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
