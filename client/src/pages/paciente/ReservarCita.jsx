import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import { toast, ToastContainer } from "react-toastify";
import { getMedicosRequest, getDisponibilidadRequest } from "../../services/medicosService";
import { reservarCitaRequest } from "../../services/citasService";
import "react-day-picker/dist/style.css";
import "react-toastify/dist/ReactToastify.css";
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
  const [fechaObj, setFechaObj] = useState(null);
  const [hora, setHora] = useState("");
  const [horaPropuesta, setHoraPropuesta] = useState("");
  const [motivo, setMotivo] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);

  const [disponibilidad, setDisponibilidad] = useState({});
  const [adicionalesRestantes, setAdicionalesRestantes] = useState({});
  const [fechasHabilitadas, setFechasHabilitadas] = useState([]);

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

  useEffect(() => {
    async function loadDispon() {
      if (!medicoId) {
        setDisponibilidad({});
        setAdicionalesRestantes({});
        setFechasHabilitadas([]);
        return;
      }
      try {
        const hoy = new Date();
        const hasta = new Date();
        hasta.setDate(hoy.getDate() + 30);
        const desdeStr = hoy.toISOString().split("T")[0];
        const hastaStr = hasta.toISOString().split("T")[0];
        const data = await getDisponibilidadRequest(medicoId, { desde: desdeStr, hasta: hastaStr });
        setDisponibilidad(data.disponibilidad || {});
        setAdicionalesRestantes(data.adicionalesRestantes || {});
        setFechasHabilitadas(Object.keys(data.disponibilidad || {}));
      } catch (err) {
        console.error(err);
        toast.error("Error al cargar disponibilidad");
      }
    }
    loadDispon();
  }, [medicoId]);

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
      const result = await reservarCitaRequest({ medico_id: medicoId, fecha, hora, motivo_consulta: motivo });
      toast.success(result.msg || "Cita reservada correctamente");
      if (result.cita?.is_adicional) {
        toast.info("La cita fue creada como adicional.");
      }
      if (result.cita?.fuera_rango) {
        toast.warn("La cita fue creada pero está fuera del horario de atención del médico.");
      }
      setSuccess("¡Cita reservada correctamente!");
      setTimeout(() => navigate("/paciente/citas"), 1200);
    } catch (err) {
      const message = err?.message || "Error al reservar";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleSolicitarAdicional = async () => {
    if (!medicoId || !fecha) {
      toast.error("Selecciona médico y fecha antes de solicitar adicional.");
      return;
    }
    // validar formato HH:MM
    const hhmm = horaPropuesta.trim();
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(hhmm)) {
      toast.error("Ingrese la hora propuesta en formato HH:MM (por ejemplo 14:30).");
      return;
    }
    setSaving(true);
    try {
      const result = await reservarCitaRequest({ medico_id: medicoId, fecha, hora: hhmm, motivo_consulta: motivo });
      toast.success(result.msg || "Solicitud enviada");
      if (result.cita?.is_adicional) toast.info("Se creó una reserva como adicional.");
      setTimeout(() => navigate("/paciente/citas"), 1200);
    } catch (err) {
      const message = err?.message || "Error al solicitar adicional";
      toast.error(message);
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  // DayPicker disabled function: disable dates not in fechasHabilitadas or past dates
  const disabledDays = (date) => {
    const ymd = date.toISOString().split("T")[0];
    const allowed = new Set(fechasHabilitadas);
    // disable past dates as well
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    return !allowed.has(ymd);
  };

  const handleDaySelect = (date) => {
    if (!date) return;
    const ymd = date.toISOString().split("T")[0];
    setFecha(ymd);
    setFechaObj(date);
    setHora("");
    setHoraPropuesta("");
  };

  return (
    <div>
      <ToastContainer />
      <h2 className="section-title">Reservar nueva cita</h2>

      {loading ? (
        <p className="empty-state">Cargando médicos disponibles...</p>
      ) : (
        <form className="crud-form" onSubmit={handleSubmit} style={{ maxWidth: 680 }}>
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

          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            <div>
              <label>Fecha</label>
              <div style={{ border: "1px solid #e5e7eb", padding: 8, borderRadius: 6 }}>
                <DayPicker mode="single" selected={fechaObj} onSelect={handleDaySelect} disabled={disabledDays} />
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div className="crud-field">
                <label>Hora</label>
                <select value={hora} onChange={(e) => setHora(e.target.value)} style={{ width: "100%" }}>
                  <option value="">Selecciona una hora</option>
                  {(disponibilidad[fecha] || []).map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              {(!disponibilidad[fecha] || disponibilidad[fecha].length === 0) && fecha && (
                <div style={{ marginTop: 12 }}>
                  <p>
                    {adicionalesRestantes[fecha] > 0 ? (
                      <>
                        No hay horarios libres para esta fecha. Quedan <strong>{adicionalesRestantes[fecha]}</strong> adicionales. Puedes proponer una hora.
                      </>
                    ) : (
                      "No hay horarios disponibles para esta fecha."
                    )}
                  </p>

                  {adicionalesRestantes[fecha] > 0 && (
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                      <input
                        placeholder="Hora propuesta (HH:MM)"
                        value={horaPropuesta}
                        onChange={(e) => setHoraPropuesta(e.target.value)}
                        style={{ padding: 8, width: 160 }}
                      />
                      <button type="button" className="btn-primary" onClick={handleSolicitarAdicional} disabled={saving}>
                        {saving ? "Enviando..." : "Solicitar adicional"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="crud-field" style={{ marginTop: 18 }}>
                <label>Motivo de consulta</label>
                <textarea
                  rows={3}
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Describe brevemente el motivo de tu consulta"
                />
              </div>

              {error && <p className="error-state">{error}</p>}
              {success && <p style={{ color: "#16a34a", fontSize: 13, marginBottom: 12 }}>{success}</p>}

              <div style={{ marginTop: 8 }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving || !fecha || (!hora && !(adicionalesRestantes[fecha] > 0 && horaPropuesta))}
                >
                  {saving ? "Reservando..." : "Confirmar reserva"}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
