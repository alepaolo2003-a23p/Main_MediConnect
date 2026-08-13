import { useEffect, useMemo, useState } from "react";
import { StatCard } from "../../components/StatCard";
import { DonutChart } from "../../components/DonutChart";
import { StatusBadge } from "../../components/StatusBadge";
import { getUsersRequest } from "../../services/usersService";
import { getMedicosRequest } from "../../services/medicosService";
import { getClinicasRequest } from "../../services/clinicasService";
import { getCitasMedicoRequest } from "../../services/citasService";
import "../dashboard-shared.scss";

const todayISO = () => new Date().toISOString().split("T")[0];

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicos, setMedicos] = useState([]);
  const [pacientesCount, setPacientesCount] = useState(0);
  const [clinicasCount, setClinicasCount] = useState(0);
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [medicosData, pacientesData, clinicasData] = await Promise.all([
          getMedicosRequest(),
          getUsersRequest({ rol: "paciente" }),
          getClinicasRequest(),
        ]);

        setMedicos(medicosData || []);
        setPacientesCount((pacientesData || []).length);
        setClinicasCount((clinicasData || []).length);

        // Agregamos las citas de todos los médicos (no hay endpoint global de citas)
        const citasPorMedico = await Promise.all(
          (medicosData || []).map((m) =>
            getCitasMedicoRequest(m._id).catch(() => [])
          )
        );
        const todasLasCitas = citasPorMedico.flat().map((c, idx) => ({
          ...c,
          _medicoNombre: (medicosData || []).find((m) => m._id === c.medico_id)?.nombre,
        }));
        setCitas(todasLasCitas);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const citasHoy = useMemo(
    () =>
      citas.filter((c) => {
        if (!c.fecha) return false;
        return new Date(c.fecha).toISOString().split("T")[0] === todayISO();
      }),
    [citas]
  );

  const citasRecientes = useMemo(
    () =>
      [...citas]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 6),
    [citas]
  );

  const estadoCounts = useMemo(() => {
    const counts = { confirmada: 0, reservada: 0, atendida: 0, cancelada: 0, no_asistio: 0 };
    citas.forEach((c) => {
      if (counts[c.estado] !== undefined) counts[c.estado] += 1;
    });
    return counts;
  }, [citas]);

  if (loading) {
    return <p className="empty-state">Cargando panel administrativo...</p>;
  }

  return (
    <div>
      {error && <p className="error-state">{error}</p>}

      <div className="stats-grid">
        <StatCard icon="🩺" label="Médicos activos" value={medicos.length} tone="teal" />
        <StatCard icon="🧑‍🤝‍🧑" label="Pacientes registrados" value={pacientesCount} />
        <StatCard icon="📅" label="Citas hoy" value={citasHoy.length} tone="warning" />
        <StatCard icon="🏥" label="Clínicas habilitadas" value={clinicasCount} tone="success" />
      </div>

      <div className="panel-grid">
        <div className="panel-card">
          <div className="panel-card__header">
            <h3>Citas recientes</h3>
          </div>
          {citasRecientes.length === 0 ? (
            <p className="empty-state">Aún no hay citas registradas.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Médico</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {citasRecientes.map((c) => (
                  <tr key={c._id}>
                    <td>{c.paciente_id?.nombre || "—"}</td>
                    <td>{c._medicoNombre || "—"}</td>
                    <td>
                      {c.fecha ? new Date(c.fecha).toLocaleDateString("es-PE") : "—"}{" "}
                      {c.hora}
                    </td>
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
            <h3>Citas por estado</h3>
          </div>
          <DonutChart
            centerValue={citas.length}
            centerLabel="Citas"
            segments={[
              { label: "Confirmadas", value: estadoCounts.confirmada, color: "#2563eb" },
              { label: "Reservadas", value: estadoCounts.reservada, color: "#d97706" },
              { label: "Atendidas", value: estadoCounts.atendida, color: "#16a34a" },
              { label: "Canceladas", value: estadoCounts.cancelada + estadoCounts.no_asistio, color: "#dc2626" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
