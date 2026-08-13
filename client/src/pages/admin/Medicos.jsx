import { useEffect, useState } from "react";
import { getMedicosRequest, registrarMedicoRequest } from "../../services/medicosService";
import { getClinicasRequest } from "../../services/clinicasService";
import "../dashboard-shared.scss";
import "./CrudPage.scss";

const PRESET_ESPECIALIDADES = [
  "Medicina General",
  "Pediatría",
  "Ginecología",
  "Cardiología",
  "Dermatología",
  "Odontología",
  "Psiquiatría",
  "Neurología",
];

const emptyForm = {
  nombre: "",
  correo: "",
  password: "",
  especialidad: "",
  especialidad_otra: "",
  clinica_id: "",
  dni: "",
  telefono: "",
};

export function Medicos() {
  const [medicos, setMedicos] = useState([]);
  const [clinicas, setClinicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [medicosData, clinicasData] = await Promise.all([
        getMedicosRequest(),
        getClinicasRequest(),
      ]);
      setMedicos(medicosData || []);
      setClinicas(clinicasData || []);
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
    setFormError(null);
    setSaving(true);
    try {
      const payload = { ...formData };
      if (payload.especialidad === "__OTRO__") {
        payload.especialidad = payload.especialidad_otra || "Otros";
      }
      // cleanup
      delete payload.especialidad_otra;

      await registrarMedicoRequest(payload);
      setFormData(emptyForm);
      setShowForm(false);
      await load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="crud-toolbar">
        <div>
          <h2 className="section-title">Médicos ({medicos.length})</h2>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancelar" : "+ Registrar médico"}
        </button>
      </div>

      {error && <p className="error-state">{error}</p>}

      {showForm && (
        <form className="crud-form" onSubmit={handleSubmit}>
          <div className="crud-form__grid">
            <div className="crud-field">
              <label>Nombre completo</label>
              <input name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className="crud-field">
              <label>Correo</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="crud-field">
              <label>Contraseña temporal</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="crud-field">
              <label>Especialidad</label>
              <select name="especialidad" value={formData.especialidad} onChange={handleChange} required>
                <option value="">Selecciona una especialidad</option>
                {PRESET_ESPECIALIDADES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                <option value="__OTRO__">Otros</option>
              </select>
            </div>

            {formData.especialidad === "__OTRO__" && (
              <div className="crud-field">
                <label>Otra especialidad</label>
                <input
                  name="especialidad_otra"
                  value={formData.especialidad_otra}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="crud-field">
              <label>Clínica</label>
              <select name="clinica_id" value={formData.clinica_id} onChange={handleChange} required>
                <option value="">Selecciona una clínica</option>
                {clinicas.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="crud-field">
              <label>DNI</label>
              <input name="dni" value={formData.dni} onChange={handleChange} />
            </div>
            <div className="crud-field">
              <label>Teléfono</label>
              <input name="telefono" value={formData.telefono} onChange={handleChange} />
            </div>
          </div>

          {formError && <p className="error-state">{formError}</p>}

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar médico"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="empty-state">Cargando médicos...</p>
      ) : medicos.length === 0 ? (
        <p className="empty-state">No hay médicos registrados aún.</p>
      ) : (
        <div className="panel-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Clínica</th>
                <th>Correo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {medicos.map((m) => (
                <tr key={m._id}>
                  <td>{m.nombre}</td>
                  <td>{m.especialidad}</td>
                  <td>{m.clinica_id?.nombre || "—"}</td>
                  <td>{m.correo}</td>
                  <td>{m.activo ? "Activo" : "Inactivo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
