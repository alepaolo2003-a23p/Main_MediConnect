import { useEffect, useState } from "react";
import { StatusBadge } from "../../components/StatusBadge";
import { getMedicosRequest } from "../../services/medicosService";
import { getCitasMedicoRequest } from "../../services/citasService";
import "../dashboard-shared.scss";
import "./CrudPage.scss";

export function CitasAdmin() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const medicos = await getMedicosRequest();
        const porMedico = await Promise.all(
          (medicos || []).map((m) =>
            getCitasMedicoRequest(m._id)
              .then((data) => data.map((c) => ({ ...c, _medicoNombre: m.nombre })))
              .catch(() => [])
          )
        );
        const todas = porMedico.flat().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setCitas(todas);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = filter === "all" ? citas : citas.filter((c) => c.estado === filter);
  const estados = ["all", "reservada", "confirmada", "atendida", "cancelada", "no_asistio"];

  return (
    <div>
      <h2 className="section-title">Citas ({citas.length})</h2>

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
                <th>Médico</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Motivo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id}>
                  <td>{c.paciente_id?.nombre || "—"}</td>
                  <td>{c._medicoNombre}</td>
                  <td>{c.fecha ? new Date(c.fecha).toLocaleDateString("es-PE") : "—"}</td>
                  <td>{c.hora}</td>
                  <td>{c.motivo_consulta || "—"}</td>
                  <td>
                    <StatusBadge status={c.estado} />
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
