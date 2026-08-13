import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMedicosRequest } from "../../services/medicosService";
import { reservarCitaRequest } from "../../services/citasService";
import "../dashboard-shared.scss";
import "../admin/CrudPage.scss";

export function ReservarCita() {
  const navigate = useNavigate();
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [especialidad, setEspecialidad] = useState("");
  const [medicoId, setMedicoId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getMedicosRequest({ active: true });
        setMedicos(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const especialidades = useMemo(
    () => [...new Set(medicos.map((m) => m.especialidad).filter(Boolean))],
    [medicos]
  );

  const medicosFiltrados = especialidad
    ? medicos.filter((m) => m.especialidad === especialidad)
    : medicos;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!medicoId || !fecha || !hora) {
      setError("Selecciona médico, fecha y hora.");
      return;
    }
    setSaving(true);
    try {
      await reservarCitaRequest({ medico_id: medicoId, fecha, hora, motivo_consulta: motivo });
      setSuccess("¡Cita reservada correctamente!");
      setTimeout(() => navigate("/paciente/citas"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h2 className="section-title">Reservar nueva cita</h2>

      {loading ? (
        <p className="empty-state">Cargando médicos disponibles...</p>
      ) : (
        <form className="crud-form" onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
          <div className="crud-field" style={{ marginBottom: 14 }}>
            <label>Especialidad</label>
            <select value={especialidad} onChange={(e) => setEspecialidad(e.target.value)}>
              <option value="">Todas las especialidades</option>
              {especialidades.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          <div className="crud-field" style={{ marginBottom: 14 }}>
            <label>Médico</label>
            <select value={medicoId} onChange={(e) => setMedicoId(e.target.value)} required>
              <option value="">Selecciona un médico</option>
              {medicosFiltrados.map((m) => (
                <option key={m._id} value={m._id}>
                  Dr(a). {m.nombre} — {m.especialidad}
                  {m.clinica_id?.nombre ? ` (${m.clinica_id.nombre})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="crud-form__grid">
            <div className="crud-field">
              <label>Fecha</label>
              <input
                type="date"
                min={minDate}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>
            <div className="crud-field">
              <label>Hora</label>
              <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
            </div>
          </div>

          <div className="crud-field" style={{ margin: "14px 0" }}>
            <label>Motivo de consulta</label>
            <textarea
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Describe brevemente el motivo de tu consulta"
            />
          </div>

          {error && <p className="error-state">{error}</p>}
          {success && (
            <p style={{ color: "#16a34a", fontSize: 13, marginBottom: 12 }}>{success}</p>
          )}

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Reservando..." : "Confirmar reserva"}
          </button>
        </form>
      )}
    </div>
  );
}
