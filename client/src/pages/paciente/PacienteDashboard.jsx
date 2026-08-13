import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { StatCard } from "../../components/StatCard";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { getCitasPacienteRequest } from "../../services/citasService";
import { getClinicasRequest } from "../../services/clinicasService";
import "../dashboard-shared.scss";

export function PacienteDashboard() {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [clinicas, setClinicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [citasData, clinicasData] = await Promise.all([
          getCitasPacienteRequest(user._id),
          getClinicasRequest({ active: true }),
        ]);
        setCitas(citasData || []);
        setClinicas((clinicasData || []).slice(0, 4));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (user?._id) load();
  }, [user]);

  const proximaCita = useMemo(() => {
    const futuras = citas
      .filter((c) => ["reservada", "confirmada"].includes(c.estado))
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    return futuras[0] || null;
  }, [citas]);

  const programadas = citas.filter((c) => ["reservada", "confirmada"].includes(c.estado));
  const completadas = citas.filter((c) => c.estado === "atendida");

  const proximasCitas = useMemo(
    () =>
      citas
        .filter((c) => ["reservada", "confirmada"].includes(c.estado))
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 3),
    [citas]
  );

  const historial = useMemo(
    () => [...citas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5),
    [citas]
  );

  if (loading) return <p className="empty-state">Cargando tu panel...</p>;

  return (
    <div>
      {error && <p className="error-state">{error}</p>}

      <div className="stats-grid">
        <StatCard
          icon="📅"
          label="Próxima cita"
          value={
            proximaCita
              ? new Date(proximaCita.fecha).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "short",
                })
              : "—"
          }
          hint={proximaCita ? `${proximaCita.hora} · Dr(a). ${proximaCita.medico_id?.nombre}` : "Sin citas próximas"}
        />
        <StatCard icon="🗓️" label="Citas programadas" value={programadas.length} />
        <StatCard icon="✅" label="Citas completadas" value={completadas.length} tone="success" />
        <StatCard icon="🔔" label="Recordatorios" value={proximasCitas.length > 0 ? 1 : 0} tone="warning" />
      </div>

      <div className="panel-grid">
        <div className="panel-card">
          <div className="panel-card__header">
            <h3>Reservar nueva cita</h3>
          </div>
          <p style={{ fontSize: 13.5, color: "#64748b", marginBottom: 14 }}>
            Encuentra al especialista y agenda tu cita en pocos pasos.
          </p>
          <Link to="/paciente/reservar" className="btn-primary" style={{ display: "inline-block" }}>
            Buscar disponibilidad
          </Link>
        </div>

        <div className="panel-card">
          <div className="panel-card__header">
            <h3>Próximas citas</h3>
            <Link to="/paciente/citas">Ver todas</Link>
          </div>
          {proximasCitas.length === 0 ? (
            <p className="empty-state">No tienes próximas citas.</p>
          ) : (
            <div className="list-card">
              {proximasCitas.map((c) => (
                <div className="list-item" key={c._id}>
                  <div className="list-item__avatar">🩺</div>
                  <div className="list-item__body">
                    <strong>Dr(a). {c.medico_id?.nombre}</strong>
                    <span>
                      {c.medico_id?.especialidad} · {new Date(c.fecha).toLocaleDateString("es-PE")} ·{" "}
                      {c.hora}
                    </span>
                  </div>
                  <StatusBadge status={c.estado} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="panel-grid">
        <div className="panel-card">
          <div className="panel-card__header">
            <h3>Historial de citas</h3>
            <Link to="/paciente/historial">Ver historial completo</Link>
          </div>
          {historial.length === 0 ? (
            <p className="empty-state">Aún no tienes citas registradas.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Médico</th>
                  <th>Especialidad</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((c) => (
                  <tr key={c._id}>
                    <td>{new Date(c.fecha).toLocaleDateString("es-PE")}</td>
                    <td>{c.medico_id?.nombre}</td>
                    <td>{c.medico_id?.especialidad}</td>
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
            <h3>Clínicas disponibles</h3>
          </div>
          {clinicas.length === 0 ? (
            <p className="empty-state">No hay clínicas disponibles.</p>
          ) : (
            <div className="list-card">
              {clinicas.map((c) => (
                <div className="list-item" key={c._id}>
                  <div className="list-item__avatar">🏥</div>
                  <div className="list-item__body">
                    <strong>{c.nombre}</strong>
                    <span>{c.direccion || "Dirección no registrada"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
