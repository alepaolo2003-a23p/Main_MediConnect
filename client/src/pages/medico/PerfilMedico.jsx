import { useAuth } from "../../hooks/useAuth";
import "../dashboard-shared.scss";
import "../admin/CrudPage.scss";

export function PerfilMedico() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="section-title">Mi perfil</h2>
      <div className="panel-card" style={{ maxWidth: 480 }}>
        <div className="crud-field" style={{ marginBottom: 14 }}>
          <label>Nombre</label>
          <input value={user?.nombre || ""} disabled />
        </div>
        <div className="crud-field" style={{ marginBottom: 14 }}>
          <label>Correo</label>
          <input value={user?.correo || ""} disabled />
        </div>
        <div className="crud-field" style={{ marginBottom: 14 }}>
          <label>Especialidad</label>
          <input value={user?.especialidad || ""} disabled />
        </div>
        <div className="crud-field">
          <label>Clínica</label>
          <input value={user?.clinica_id?.nombre || "—"} disabled />
        </div>
      </div>
    </div>
  );
}
