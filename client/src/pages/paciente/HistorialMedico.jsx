import { useEffect, useState } from "react";
import { getMisNotasRequest } from "../../services/historiaClinicaService";
import "../dashboard-shared.scss";

export function HistorialMedico() {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getMisNotasRequest();
        setNotas(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h2 className="section-title">Mi historial médico</h2>

      {error && <p className="error-state">{error}</p>}

      {loading ? (
        <p className="empty-state">Cargando historial...</p>
      ) : notas.length === 0 ? (
        <p className="empty-state">Aún no tienes notas clínicas registradas.</p>
      ) : (
        <div className="list-card">
          {notas.map((n) => (
            <div className="panel-card" key={n._id}>
              <div className="panel-card__header">
                <h3>{new Date(n.fecha).toLocaleDateString("es-PE")}</h3>
                <span style={{ fontSize: 12.5, color: "#64748b" }}>
                  Dr(a). {n.medico_id?.nombre} · {n.medico_id?.especialidad}
                </span>
              </div>
              <p style={{ margin: "4px 0", fontSize: 13.5 }}>
                <strong>Motivo: </strong>
                {n.motivo_consulta || "—"}
              </p>
              <p style={{ margin: "4px 0", fontSize: 13.5 }}>
                <strong>Diagnóstico: </strong>
                {n.diagnostico || "—"}
              </p>
              <p style={{ margin: "4px 0", fontSize: 13.5 }}>
                <strong>Tratamiento: </strong>
                {n.tratamiento || "—"}
              </p>
              {n.observaciones && (
                <p style={{ margin: "4px 0", fontSize: 13.5 }}>
                  <strong>Observaciones: </strong>
                  {n.observaciones}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
