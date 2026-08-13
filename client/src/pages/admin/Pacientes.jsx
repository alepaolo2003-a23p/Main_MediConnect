import { useEffect, useState } from "react";
import { getUsersRequest } from "../../services/usersService";
import "../dashboard-shared.scss";
import "./CrudPage.scss";

export function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getUsersRequest({ rol: "paciente" });
        setPacientes(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = pacientes.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.nombre?.toLowerCase().includes(term) || p.correo?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="crud-toolbar">
        <h2 className="section-title">Pacientes ({pacientes.length})</h2>
        <input
          placeholder="Buscar por nombre o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "9px 13px",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 13.5,
            minWidth: 240,
          }}
        />
      </div>

      {error && <p className="error-state">{error}</p>}

      {loading ? (
        <p className="empty-state">Cargando pacientes...</p>
      ) : filtered.length === 0 ? (
        <p className="empty-state">No se encontraron pacientes.</p>
      ) : (
        <div className="panel-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>DNI</th>
                <th>Teléfono</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td>{p.nombre}</td>
                  <td>{p.correo}</td>
                  <td>{p.dni || "—"}</td>
                  <td>{p.telefono || "—"}</td>
                  <td>{p.activo ? "Activo" : "Inactivo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
