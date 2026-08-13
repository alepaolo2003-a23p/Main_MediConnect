import { useEffect, useState } from "react";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { getCitasMedicoRequest, actualizarEstadoCitaRequest } from "../../services/citasService";
import "../dashboard-shared.scss";
import "../admin/CrudPage.scss";

export function CitasMedico() {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
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
  };

  useEffect(() => {
    if (user?._id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleEstado = async (id, estado) => {
    setUpdatingId(id);
    try {
      const updated = await actualizarEstadoCitaRequest(id, estado);
      setCitas((prev) => prev.map((c) => (c._id === id ? { ...c, estado: updated.estado } : c)));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
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
        <p className="empty-state">Cargando citas...</p>
      ) : filtered.length === 0 ? (
        <p className="empty-state">No hay citas para este filtro.</p>
      ) : (
        <div className="panel-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id}>
                  <td>{c.paciente_id?.nombre || "—"}</td>
                  <td>{c.fecha ? new Date(c.fecha).toLocaleDateString("es-PE") : "—"}</td>
                  <td>{c.hora}</td>
                  <td>{c.motivo_consulta || "—"}</td>
                  <td>
                    <StatusBadge status={c.estado} />
                  </td>
                  <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["reservada"].includes(c.estado) && (
                      <button
                        className="link"
                        disabled={updatingId === c._id}
                        onClick={() => handleEstado(c._id, "confirmada")}
                      >
                        Confirmar
                      </button>
                    )}
                    {["reservada", "confirmada"].includes(c.estado) && (
                      <>
                        <button
                          className="link"
                          disabled={updatingId === c._id}
                          onClick={() => handleEstado(c._id, "atendida")}
                        >
                          Marcar atendida
                        </button>
                        <button
                          className="link"
                          disabled={updatingId === c._id}
                          onClick={() => handleEstado(c._id, "no_asistio")}
                        >
                          No asistió
                        </button>
                      </>
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
