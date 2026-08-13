import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getCitasMedicoRequest } from "../../services/citasService";
import { createNotaRequest, getHistorialPacienteRequest } from "../../services/historiaClinicaService";
import "../dashboard-shared.scss";
import "../admin/CrudPage.scss";

const emptyForm = { diagnostico: "", tratamiento: "", observaciones: "" };

export function HistoriasMedico() {
  const { user } = useAuth();
  const [citasAtendidas, setCitasAtendidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCita, setActiveCita] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [historialPacienteId, setHistorialPacienteId] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCitasMedicoRequest(user._id);
        setCitasAtendidas((data || []).filter((c) => c.estado === "atendida"));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (user?._id) load();
  }, [user]);

  const openForm = (cita) => {
    setActiveCita(cita);
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createNotaRequest({
        cita_id: activeCita._id,
        paciente_id: activeCita.paciente_id._id,
        motivo_consulta: activeCita.motivo_consulta,
        ...formData,
      });
      setActiveCita(null);
      alert("Nota clínica guardada correctamente");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const verHistorial = async (pacienteId) => {
    setHistorialPacienteId(pacienteId);
    try {
      const data = await getHistorialPacienteRequest(pacienteId);
      setHistorial(data || []);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2 className="section-title">Historias clínicas</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginTop: -8, marginBottom: 16 }}>
        Registra el diagnóstico de tus citas atendidas y consulta el historial de cada paciente.
      </p>

      {error && <p className="error-state">{error}</p>}

      {loading ? (
        <p className="empty-state">Cargando citas atendidas...</p>
      ) : citasAtendidas.length === 0 ? (
        <p className="empty-state">No tienes citas marcadas como atendidas todavía.</p>
      ) : (
        <div className="panel-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Fecha</th>
                <th>Motivo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citasAtendidas.map((c) => (
                <tr key={c._id}>
                  <td>{c.paciente_id?.nombre}</td>
                  <td>{new Date(c.fecha).toLocaleDateString("es-PE")}</td>
                  <td>{c.motivo_consulta || "—"}</td>
                  <td style={{ display: "flex", gap: 10 }}>
                    <button className="link" onClick={() => openForm(c)}>
                      Registrar nota
                    </button>
                    <button className="link" onClick={() => verHistorial(c.paciente_id._id)}>
                      Ver historial
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeCita && (
        <form className="crud-form" onSubmit={handleSubmit} style={{ marginTop: 18 }}>
          <h3 style={{ marginTop: 0 }}>
            Nota clínica — {activeCita.paciente_id?.nombre}
          </h3>
          <div className="crud-field" style={{ marginBottom: 12 }}>
            <label>Diagnóstico</label>
            <textarea
              name="diagnostico"
              rows={2}
              value={formData.diagnostico}
              onChange={handleChange}
              required
            />
          </div>
          <div className="crud-field" style={{ marginBottom: 12 }}>
            <label>Tratamiento</label>
            <textarea
              name="tratamiento"
              rows={2}
              value={formData.tratamiento}
              onChange={handleChange}
            />
          </div>
          <div className="crud-field" style={{ marginBottom: 14 }}>
            <label>Observaciones</label>
            <textarea
              name="observaciones"
              rows={2}
              value={formData.observaciones}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Guardando..." : "Guardar nota"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setActiveCita(null)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {historialPacienteId && (
        <div className="panel-card" style={{ marginTop: 18 }}>
          <div className="panel-card__header">
            <h3>Historial del paciente</h3>
            <button className="link" onClick={() => setHistorialPacienteId(null)}>
              Cerrar
            </button>
          </div>
          {historial.length === 0 ? (
            <p className="empty-state">Sin registros previos.</p>
          ) : (
            <div className="list-card">
              {historial.map((h) => (
                <div className="list-item" key={h._id}>
                  <div className="list-item__body">
                    <strong>{h.diagnostico || "Sin diagnóstico registrado"}</strong>
                    <span>
                      {new Date(h.fecha).toLocaleDateString("es-PE")} · Dr(a).{" "}
                      {h.medico_id?.nombre} · {h.tratamiento || "Sin tratamiento indicado"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
