# MediConnect — Frontend

Frontend de MediConnect (React + Vite) conectado a tu API `MediConnect-API`
(Node.js + Express + MongoDB) ya existente. Incluye los 3 paneles por rol:
**Administrador**, **Médico** y **Paciente**.

## 1. Requisitos

- Node.js 18+
- Tu backend `server/` corriendo en `http://localhost:3977/api/v1`
  (con datos de prueba: ejecuta `node seed.js` una vez dentro de `server/` si
  aún no lo hiciste)

## 2. Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

El frontend corre en `http://localhost:3000`. El backend acepta ese origen
por CORS (revisa `app.js` → `cors({ origin: "http://localhost:3000" })`).

## 3. Variables de entorno

`.env`:
```
VITE_API_URL=http://localhost:3977/api/v1
```

Si despliegas el backend en otra URL, solo cambia esta variable — todo el
frontend la usa a través de `src/services/apiClient.js`.

## 4. Cuentas de prueba (creadas por `seed.js` en el backend)

| Rol            | Correo                          | Password    |
|----------------|----------------------------------|-------------|
| Administrador  | admin@mediconnect.com            | admin123    |
| Médico         | carlos.ramirez@mediconnect.com   | medico123   |
| Paciente       | juan.perez@example.com           | paciente123 |

## 5. Estructura

```
src/
  context/        AuthContext + AuthProvider (JWT, refresh automático)
  hooks/           useAuth
  services/        Un archivo por recurso de la API (auth, users, medicos,
                    clinicas, citas, historiaClinica)
  components/       Piezas reutilizables: StatCard, DonutChart, StatusBadge,
                    ProtectedRoute
  layouts/          DashboardLayout (sidebar dinámico por rol) + navConfig
  pages/
    auth/           Login, Register
    admin/          Dashboard, Médicos, Pacientes, Clínicas, Citas, Usuarios,
                    Configuración
    medico/         Dashboard, Horarios, Citas, Pacientes, Historias, Perfil
    paciente/        Dashboard, Mis citas, Reservar cita, Historial, Perfil
  router/           AppRouter.jsx — todas las rutas protegidas por rol
```

## 6. Cómo funciona la autenticación

El JWT del backend solo contiene `user_id` (no el rol), así que:

1. Al hacer login, el frontend guarda `access`, `refresh` y el objeto
   `usuario` (con su `rol`) que devuelve `/auth/login` directamente en
   `localStorage`.
2. En cada carga de la app, `AuthProvider` valida la sesión llamando a
   `GET /user/me` (que si detecta el token expirado, dispara automáticamente
   el refresh vía `apiClient.js`).
3. `ProtectedRoute` compara `user.rol` contra los roles permitidos de cada
   ruta y redirige si no coincide.

## 7. Notas sobre el backend

- No existe un endpoint que liste **todas** las citas del sistema, solo por
  médico (`/citas/medico/:id`) o por paciente (`/citas/paciente/:id`). Para
  el dashboard de Administrador y la vista de Citas, el frontend agrega los
  resultados recorriendo la lista de médicos. Funciona bien con pocos
  médicos; si tu clínica crece mucho, conviene agregar un endpoint
  `GET /citas` con filtros en el backend.
- `GET /users` no está restringido por rol en el router actual — cualquier
  usuario autenticado puede listarlos. El frontend solo expone esa pantalla
  en el panel de Administrador, pero si quieres reforzarlo, agrega
  `verificarAdmin` a esa ruta en `router/user.js`.

## 8. Build de producción

```bash
npm run build
npm run preview
```
