import { useEffect, useState } from "react";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { getCitasPacienteRequest, cancelarCitaRequest } from "../../services/citasService";
import "../dashboard-shared.scss";
import "../admin/CrudPage.scss";

export function MisCitas() {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [cancelingId, setCancelingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCitasPacienteRequest(user._id);
      setCitas(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCancelar = async (id) => {
    if (!confirm("¿Cancelar esta cita? Solo es posible con 24h de anticipación.")) return;
    setCancelingId(id);
    try {
      const updated = await cancelarCitaRequest(id);
      setCitas((prev) => prev.map((c) => (c._id === id ? { ...c, estado: updated.estado } : c)));
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelingId(null);
    }
  };

  const filtered = filter === "all" ? citas : citas.filter((c) => c.estado === filter);
  const estados = ["all", "reservada", "confirmada", "atendida", "cancelada", "no_asistio"];

  return (
    <div>
      <h2 className="section-title">Mis citas ({citas.length})</h2>

      <div className="filter-bar">
        {estados.map((e) => (
          <button key={e} className={filter === e ? "active" : ""} onClick={() => setFilter(e)}>
            {e === "all" ? "Todas" : e}
          </button>
        ))}
      </div>

      {error && <p className="error-state">{error}</p>}

      {loading ? (
        <p className="empty-state">Cargando tus citas...</p>
      ) : filtered.length === 0 ? (
        <p className="empty-state">No tienes citas en este filtro.</p>
      ) : (
        <div className="panel-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Médico</th>
                <th>Especialidad</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id}>
                  <td>{c.medico_id?.nombre}</td>
                  <td>{c.medico_id?.especialidad}</td>
                  <td>{new Date(c.fecha).toLocaleDateString("es-PE")}</td>
                  <td>{c.hora}</td>
                  <td>
                    <StatusBadge status={c.estado} />
                  </td>
                  <td>
                    {["reservada", "confirmada"].includes(c.estado) && (
                      <button
                        className="link"
                        disabled={cancelingId === c._id}
                        onClick={() => handleCancelar(c._id)}
                      >
                        Cancelar
                      </button>
                    )}
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
