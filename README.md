# MediConnect

Proyecto: Sistema de gestión de turnos médicos (MediConnect)

Este repositorio contiene el backend (Node.js + Express + MongoDB) y el frontend (React + Vite) para una aplicación de reservas de citas médicas con soporte de disponibilidad por fecha, "adicionales" por fecha, y notificaciones en tiempo real mediante Socket.IO.

---

## Estructura

- `/server` — API REST (Node.js, Express, Mongoose)
- `/client` — Frontend (React, Vite)

---

## Requisitos

- Node.js 18+
- MongoDB (local o Atlas)

---

## Variables de entorno

Servidor (`/server/.env`)

- DB_HOST — URI de MongoDB (p. ej. `mongodb://localhost:27017/medi_connect`)
- JWT_SECRET_KEY — secreto para firmar/verificar JWT (obligatorio para sockets autenticados)
- API_VERSION — opcional (por defecto `v1`)
- IP_SERVER — opcional (por defecto `localhost`)

Cliente (`/client/.env`)

- VITE_API_URL — URL base a la API (p. ej. `http://localhost:3977/api/v1`)

---

## Instalación y ejecución (desarrollo)

1. Clonar el repositorio

```bash
git clone https://github.com/alepaolo2003-a23p/Main_MediConnect.git
cd Main_MediConnect
```

2. Backend

```bash
cd server
npm install
# exporta variables o crea .env con JWT_SECRET_KEY y DB_HOST
export JWT_SECRET_KEY="tu_secreto"
export DB_HOST="mongodb://localhost:27017/medi_connect"
npm run dev
```

El servidor por defecto corre en `http://localhost:3977/api/v1`.

3. Frontend

```bash
cd ../client
npm install
# crear .env con VITE_API_URL, p. ej.:
# VITE_API_URL=http://localhost:3977/api/v1
npm run dev
```

El cliente por defecto corre en `http://localhost:3000`.

---

## Features relevantes añadidos en la rama feature/disponibilidad-sockets-reservas-calendar

- Endpoint de disponibilidad por médico:
  - GET /medicos/disponibilidad/:medico_id?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
  - Respuesta: { disponibilidad: { 'YYYY-MM-DD': ['HH:MM', ...] }, adicionalesRestantes: { 'YYYY-MM-DD': n } }
- Reservas protegidas por horario y bloqueos (backend valida que la reserva esté dentro del horario configurado); se soportan "adicionales" por fecha cuando no haya slots libres.
- Campo "Hora propuesta (HH:MM)" en la UI de paciente para solicitar un adicional cuando no hay slots disponibles.
- Notificaciones en tiempo real para médicos mediante Socket.IO. El servidor autentica sockets vía JWT en el handshake y une el socket a la room correspondiente al user_id.
- Reconexión automática del socket en el cliente cuando el accessToken se renueva (evento global `accessTokenRefreshed`).
- Formulario de administración de médicos: select de especialidades con opción "Otros".

---

## Cómo probar (checklist)

1. Levantar servidor y cliente (ver sección anterior).
2. Crear usuarios con `seed.js` si aplica o registrar cuentas desde la UI.
3. Como administrador o médico: configurar horario del médico (días y duración de cita).
4. Como paciente: ir a Reservar Cita → seleccionar médico → el calendario (DayPicker) mostrará sólo las fechas habilitadas.
5. Seleccionar una fecha:
   - Si hay slots libres, reservar normalmente.
   - Si no hay slots y `adicionalesRestantes[fecha] > 0`, usar "Hora propuesta (HH:MM)" y pulsar "Solicitar adicional".
6. Ver en la consola del servidor la emisión del evento `nueva_cita` y en el dashboard del médico ver la notificación en tiempo real (toast).
7. Probar expiración/refresh del token para verificar que el cliente reconecta automáticamente:
   - Provoca un 401 (por ejemplo, forzando expiración o borrando accessToken y ejecutando una petición que fuerce refresh). `apiClient` renovará el token usando refreshToken y emitirá un evento `accessTokenRefreshed` que hará que el socket se reconecte con el token nuevo.

---

## Notas técnicas y recomendaciones

- MAX_ADICIONALES_POR_FECHA actualmente está fijado en 10 (en el controlador del servidor). Si quieres, puede moverse a variable de entorno antes de mergear.
- Asegurar TLS (https / wss) y configurar CORS apropiadamente en producción.
- Se recomienda eliminar el fallback `socket.on('join', ...)` en servidor si quieres forzar que todas las conexiones pasen por el handshake autenticado.
- Autenticación de sockets: el cliente debe pasar `accessToken` en el handshake: io(baseUrl, { auth: { token: accessToken } })

---

## Archivos modificados (lista resumida)

- server/index.js
- server/controllers/cita.js
- server/controllers/medico.js
- server/router/medico.js
- client/src/services/apiClient.js
- client/src/services/medicosService.js
- client/src/services/citasService.js
- client/src/pages/paciente/ReservarCita.jsx
- client/src/pages/medico/MedicoDashboard.jsx
- client/src/pages/admin/Medicos.jsx
- package.json (client & server): dependencias nuevas (socket.io, socket.io-client, react-day-picker, react-toastify)

---

Si quieres que mueva MAX_ADICIONALES_POR_FECHA a variable de entorno, añadamos `MAX_ADICIONALES_POR_FECHA` en `server/constants.js` y usemos `process.env.MAX_ADICIONALES_POR_FECHA || 10`.

Si quieres que haga algún ajuste al README (más detalle, formato, enlaces al PR o instrucciones para despliegue), dime exactamente qué incluir y lo actualizo en la misma rama.