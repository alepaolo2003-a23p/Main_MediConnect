import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getCitasMedicoRequest } from "../../services/citasService";
import "../dashboard-shared.scss";
import "../admin/CrudPage.scss";

export function PacientesMedico() {
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

  const pacientes = useMemo(() => {
    const map = new Map();
    citas.forEach((c) => {
      const p = c.paciente_id;
      if (!p?._id) return;
      if (!map.has(p._id)) {
        map.set(p._id, { ...p, citasCount: 0, ultimaCita: null });
      }
      const entry = map.get(p._id);
      entry.citasCount += 1;
      if (!entry.ultimaCita || new Date(c.fecha) > new Date(entry.ultimaCita)) {
        entry.ultimaCita = c.fecha;
      }
    });
    return Array.from(map.values());
  }, [citas]);

  return (
    <div>
      <h2 className="section-title">Mis pacientes ({pacientes.length})</h2>

      {error && <p className="error-state">{error}</p>}

      {loading ? (
        <p className="empty-state">Cargando pacientes...</p>
      ) : pacientes.length === 0 ? (
        <p className="empty-state">Aún no tienes pacientes con citas registradas.</p>
      ) : (
        <div className="panel-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Citas contigo</th>
                <th>Última cita</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p._id}>
                  <td>{p.nombre}</td>
                  <td>{p.correo || "—"}</td>
                  <td>{p.telefono || "—"}</td>
                  <td>{p.citasCount}</td>
                  <td>{p.ultimaCita ? new Date(p.ultimaCita).toLocaleDateString("es-PE") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
