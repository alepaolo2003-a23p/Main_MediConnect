import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { configurarHorarioRequest, getHorarioRequest } from "../../services/medicosService";
import "../dashboard-shared.scss";
import "../admin/CrudPage.scss";

const DIAS = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

export function HorariosMedico() {
  const { user } = useAuth();
  const [horario, setHorario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDias, setSelectedDias] = useState([]);
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFin, setHoraFin] = useState("17:00");
  const [duracion, setDuracion] = useState(30);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getHorarioRequest(user._id);
        setHorario(data);
        if (data?.dias) {
          setSelectedDias(data.dias.map((d) => d.dia));
          setHoraInicio(data.dias[0]?.hora_inicio || "08:00");
          setHoraFin(data.dias[0]?.hora_fin || "17:00");
          setDuracion(data.duracion_cita || 30);
        }
      } catch {
        setHorario(null);
      } finally {
        setLoading(false);
      }
    }
    if (user?._id) load();
  }, [user]);

  const toggleDia = (value) => {
    setSelectedDias((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const dias = selectedDias.map((dia) => ({
        dia,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
      }));
      const saved = await configurarHorarioRequest({
        medico_id: user._id,
        dias,
        duracion_cita: Number(duracion),
      });
      setHorario(saved);
      setMessage({ type: "success", text: "Horario guardado correctamente." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="empty-state">Cargando horario...</p>;

  return (
    <div>
      <h2 className="section-title">Mis horarios</h2>

      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="crud-field" style={{ marginBottom: 14 }}>
          <label>Días de atención</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {DIAS.map((d) => (
              <button
                type="button"
                key={d.value}
                onClick={() => toggleDia(d.value)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 999,
                  border: "1px solid #e2e8f0",
                  background: selectedDias.includes(d.value) ? "#2563eb" : "#fff",
                  color: selectedDias.includes(d.value) ? "#fff" : "#0f172a",
                  fontSize: 12.5,
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="crud-form__grid">
          <div className="crud-field">
            <label>Hora inicio</label>
            <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
          </div>
          <div className="crud-field">
            <label>Hora fin</label>
            <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
          </div>
          <div className="crud-field">
            <label>Duración por cita (min)</label>
            <input
              type="number"
              min={10}
              step={5}
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
            />
          </div>
        </div>

        {message && (
          <p className={message.type === "success" ? "" : "error-state"}>{message.text}</p>
        )}

        <button type="submit" className="btn-primary" disabled={saving || selectedDias.length === 0}>
          {saving ? "Guardando..." : "Guardar horario"}
        </button>
      </form>

      {horario && (
        <div className="panel-card" style={{ marginTop: 18 }}>
          <div className="panel-card__header">
            <h3>Horario configurado</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Día</th>
                <th>Hora inicio</th>
                <th>Hora fin</th>
              </tr>
            </thead>
            <tbody>
              {horario.dias.map((d, i) => (
                <tr key={i}>
                  <td>{DIAS.find((x) => x.value === d.dia)?.label}</td>
                  <td>{d.hora_inicio}</td>
                  <td>{d.hora_fin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
