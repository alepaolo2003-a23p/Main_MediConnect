import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { DashboardLayout } from "../layouts/DashboardLayout";

import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { Home } from "../pages/Home";
import { NotFound } from "../pages/NotFound";

import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { CitasAdmin } from "../pages/admin/CitasAdmin";
import { Clinicas } from "../pages/admin/Clinicas";
import { Configuracion } from "../pages/admin/Configuracion";
import { Medicos } from "../pages/admin/Medicos";
import { Pacientes } from "../pages/admin/Pacientes";
import { Usuarios } from "../pages/admin/Usuarios";

import { CitasMedico } from "../pages/medico/CitasMedico";
import { HistoriasMedico } from "../pages/medico/HistoriasMedico";
import { HorariosMedico } from "../pages/medico/HorariosMedico";
import { MedicoDashboard } from "../pages/medico/MedicoDashboard";
import { PacientesMedico } from "../pages/medico/PacientesMedico";
import { PerfilMedico } from "../pages/medico/PerfilMedico";

import { HistorialMedico } from "../pages/paciente/HistorialMedico";
import { MisCitas } from "../pages/paciente/MisCitas";
import { PacienteDashboard } from "../pages/paciente/PacienteDashboard";
import { PerfilPaciente } from "../pages/paciente/PerfilPaciente";
import { ReservarCita } from "../pages/paciente/ReservarCita";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />

      {/* ===== ADMINISTRADOR ===== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["administrador"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="medicos" element={<Medicos />} />
        <Route path="pacientes" element={<Pacientes />} />
        <Route path="clinicas" element={<Clinicas />} />
        <Route path="citas" element={<CitasAdmin />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="configuracion" element={<Configuracion />} />
      </Route>

      {/* ===== MEDICO ===== */}
      <Route
        path="/medico"
        element={
          <ProtectedRoute roles={["medico"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MedicoDashboard />} />
        <Route path="horarios" element={<HorariosMedico />} />
        <Route path="citas" element={<CitasMedico />} />
        <Route path="pacientes" element={<PacientesMedico />} />
        <Route path="historias" element={<HistoriasMedico />} />
        <Route path="perfil" element={<PerfilMedico />} />
      </Route>

      {/* ===== PACIENTE ===== */}
      <Route
        path="/paciente"
        element={
          <ProtectedRoute roles={["paciente"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PacienteDashboard />} />
        <Route path="citas" element={<MisCitas />} />
        <Route path="reservar" element={<ReservarCita />} />
        <Route path="historial" element={<HistorialMedico />} />
        <Route path="perfil" element={<PerfilPaciente />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
