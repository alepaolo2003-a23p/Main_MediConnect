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

        io.on('connection', (socket) => {
            console.log('Socket conectado:', socket.id);
            socket.on('join', (userId) => {
                if (userId) {
                    socket.join(String(userId));
                    console.log(`Socket ${socket.id} se unió a room ${userId}`);
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
