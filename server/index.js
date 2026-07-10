require('dotenv').config();
const mongoose = require("mongoose");
const app = require("./app");
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
        app.listen(PORT, () => {
            console.log("##########################");
            console.log("####### MediConnect ######");
            console.log("##########################");
            console.log(`http://${IP_SERVER}:${PORT}/api/${API_VERSION}`);
        });
    })
    .catch((error) => {
        console.error("Error de conexion:", error.message);
    });