export const NAV_BY_ROLE = {
  administrador: {
    title: "Panel administrador",
    items: [
      { to: "/admin", label: "Dashboard", icon: "🏠", end: true },
      { to: "/admin/medicos", label: "Médicos", icon: "🩺" },
      { to: "/admin/pacientes", label: "Pacientes", icon: "🧑‍🤝‍🧑" },
      { to: "/admin/clinicas", label: "Clínicas", icon: "🏥" },
      { to: "/admin/citas", label: "Citas", icon: "📅" },
      { to: "/admin/usuarios", label: "Usuarios", icon: "👥" },
      { to: "/admin/configuracion", label: "Configuración", icon: "⚙️" },
    ],
  },
  medico: {
    title: "Panel médico",
    items: [
      { to: "/medico", label: "Dashboard", icon: "🏠", end: true },
      { to: "/medico/horarios", label: "Mis horarios", icon: "🕒" },
      { to: "/medico/citas", label: "Citas", icon: "📅" },
      { to: "/medico/pacientes", label: "Pacientes", icon: "🧑‍🤝‍🧑" },
      { to: "/medico/historias", label: "Historias clínicas", icon: "📋" },
      { to: "/medico/perfil", label: "Perfil", icon: "👤" },
    ],
  },
  paciente: {
    title: "Mi panel",
    items: [
      { to: "/paciente", label: "Inicio", icon: "🏠", end: true },
      { to: "/paciente/citas", label: "Mis citas", icon: "📅" },
      { to: "/paciente/reservar", label: "Reservar cita", icon: "➕" },
      { to: "/paciente/historial", label: "Historial médico", icon: "📋" },
      { to: "/paciente/perfil", label: "Perfil", icon: "👤" },
    ],
  },
};
