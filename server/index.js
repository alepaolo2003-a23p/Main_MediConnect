require('dotenv').config();
const mongoose = require("mongoose");
const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const {
    DB_USER,
    DB_HOST,
    DB_PASSWORD,
    API_VERSION,
    IP_SERVER,
} = require("./constants");

const { verifyToken } = require("./utils/jwt");

// CONEXIÓN USANDO VARIABLES DE ENTORNO
//const MONGO_URI = `mongodb+srv://admin:admin123@cluster0.rdzgpga.mongodb.net/MediConnect?appName=Cluster0`;
const MONGO_URI = DB_HOST;
const PORT = process.env.PORT || 3977;

mongoose.connect(MONGO_URI)
    .then(() => {
        const server = http.createServer(app);
        const io = new Server(server, { cors: { origin: "http://localhost:3000" } });

        // Exponer io para que los controllers lo usen vía req.app.get('io')
        app.set('io', io);

        // Autenticación de sockets usando JWT: el cliente debe enviar { auth: { token } }
        io.use((socket, next) => {
            const token = socket.handshake.auth?.token || (socket.handshake.headers && socket.handshake.headers.authorization && socket.handshake.headers.authorization.split(' ')[1]);
            if (!token) return next(new Error('Auth error'));
            try {
                const payload = verifyToken(token);
                // payload contiene user_id según utils/jwt
                socket.user_id = payload.user_id || payload.user_id;
                return next();
            } catch (err) {
                console.warn('Socket auth failed:', err.message);
                return next(new Error('Auth error'));
            }
        });

        io.on('connection', (socket) => {
            console.log('Socket conectado:', socket.id, 'user_id=', socket.user_id);
            // Si el token era válido, unimos el socket a la room del usuario
            if (socket.user_id) {
                socket.join(String(socket.user_id));
                console.log(`Socket ${socket.id} se unió a room ${socket.user_id}`);
            }

            // Mantener compatibilidad: aceptar join explícito (por si hay clientes antiguos)
            socket.on('join', (userId) => {
                if (userId) {
                    socket.join(String(userId));
                    console.log(`Socket ${socket.id} se unió a room ${userId} (join request)`);
                }
            });
        });

        server.listen(PORT, () => {
            console.log("##########################");
            console.log("####### MediConnect ######");
            console.log("##########################");
            console.log(`http://${IP_SERVER}:${PORT}/api/${API_VERSION}`);
        });
    })
    .catch((error) => {
        console.error("Error de conexion:", error.message);
    });
