import { useEffect, useMemo, useState } from "react";
import { StatCard } from "../../components/StatCard";
import { DonutChart } from "../../components/DonutChart";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { getCitasMedicoRequest } from "../../services/citasService";
import "../dashboard-shared.scss";

const todayISO = () => new Date().toISOString().split("T")[0];

export function MedicoDashboard() {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCitasMedicoRequest(user._id);
        setCitas(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (user?._id) load();
  }, [user]);

  const citasHoy = useMemo(
    () => citas.filter((c) => c.fecha && new Date(c.fecha).toISOString().split("T")[0] === todayISO()),
    [citas]
  );

  const completadasHoy = citasHoy.filter((c) => c.estado === "atendida");
  const ausenciasHoy = citasHoy.filter((c) => c.estado === "no_asistio");

  const pacientesAtendidos = useMemo(() => {
    const ids = new Set(
      citas.filter((c) => c.estado === "atendida").map((c) => c.paciente_id?._id)
    );
    return ids.size;
  }, [citas]);

  const tasaAsistencia = useMemo(() => {
    const finalizadas = citas.filter((c) => c.estado === "atendida" || c.estado === "no_asistio");
    if (finalizadas.length === 0) return 0;
    const atendidas = finalizadas.filter((c) => c.estado === "atendida").length;
    return Math.round((atendidas / finalizadas.length) * 100);
  }, [citas]);

  const proximasCitas = useMemo(
    () =>
      citas
        .filter((c) => ["reservada", "confirmada"].includes(c.estado))
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 5),
    [citas]
  );

  const estadoCounts = useMemo(() => {
    const counts = { confirmada: 0, reservada: 0, atendida: 0, no_asistio: 0, cancelada: 0 };
    citas.forEach((c) => {
      if (counts[c.estado] !== undefined) counts[c.estado] += 1;
    });
    return counts;
  }, [citas]);

  if (loading) return <p className="empty-state">Cargando tu dashboard...</p>;

  return (
    <div>
      {error && <p className="error-state">{error}</p>}

      <div className="stats-grid">
        <StatCard icon="📅" label="Citas de hoy" value={citasHoy.length} />
        <StatCard icon="✅" label="Completadas hoy" value={completadasHoy.length} tone="success" />
        <StatCard icon="🧑‍🤝‍🧑" label="Pacientes atendidos" value={pacientesAtendidos} tone="teal" />
        <StatCard icon="⛔" label="Ausencias hoy" value={ausenciasHoy.length} tone="danger" />
      </div>

      <div className="panel-grid">
        <div className="panel-card">
          <div className="panel-card__header">
            <h3>Horario de hoy</h3>
          </div>
          {citasHoy.length === 0 ? (
            <p className="empty-state">No tienes citas programadas para hoy.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Paciente</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {citasHoy.map((c) => (
                  <tr key={c._id}>
                    <td>{c.hora}</td>
                    <td>{c.paciente_id?.nombre || "—"}</td>
                    <td>{c.motivo_consulta || "—"}</td>
                    <td>
                      <StatusBadge status={c.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="panel-card">
          <div className="panel-card__header">
            <h3>Resumen de citas</h3>
          </div>
          <DonutChart
            centerValue={citas.length}
            centerLabel="Total"
            segments={[
              { label: "Atendidas", value: estadoCounts.atendida, color: "#16a34a" },
              { label: "Confirmadas", value: estadoCounts.confirmada, color: "#2563eb" },
              { label: "Reservadas", value: estadoCounts.reservada, color: "#d97706" },
              { label: "No asistió", value: estadoCounts.no_asistio, color: "#dc2626" },
            ]}
          />
          <div style={{ marginTop: 16, fontSize: 13 }}>
            <strong>Tasa de asistencia: {tasaAsistencia}%</strong>
            <div
              style={{
                height: 6,
                background: "#eef1f5",
                borderRadius: 999,
                marginTop: 6,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${tasaAsistencia}%`,
                  background: "#16a34a",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-card__header">
          <h3>Próximas citas</h3>
        </div>
        {proximasCitas.length === 0 ? (
          <p className="empty-state">No tienes próximas citas.</p>
        ) : (
          <div className="list-card">
            {proximasCitas.map((c) => (
              <div className="list-item" key={c._id}>
                <div className="list-item__avatar">
                  {c.paciente_id?.nombre?.charAt(0) || "P"}
                </div>
                <div className="list-item__body">
                  <strong>{c.paciente_id?.nombre}</strong>
                  <span>
                    {new Date(c.fecha).toLocaleDateString("es-PE")} · {c.hora} ·{" "}
                    {c.motivo_consulta || "Consulta"}
                  </span>
                </div>
                <StatusBadge status={c.estado} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
