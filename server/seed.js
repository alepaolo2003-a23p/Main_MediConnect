require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Usuario = require("./models/Usuario");
const Clinica = require("./models/Clinica");
const { DB_HOST } = require("./constants");

async function seed() {
    try {
        await mongoose.connect(DB_HOST);
        console.log("Conectado a MongoDB para poblar datos de prueba");

        const salt = bcrypt.genSaltSync(10);

        const clinica = await Clinica.create({
            nombre: "Clínica MediConnect Central",
            direccion: "Av. Principal 123, Lima",
            telefono: "999888777",
            correo: "contacto@mediconnect.com",
            activo: true
        });

        const admin = await Usuario.create({
            nombre: "Admin MediConnect",
            correo: "admin@mediconnect.com",
            password: bcrypt.hashSync("admin123", salt),
            rol: "administrador",
            activo: true
        });

        const medico = await Usuario.create({
            nombre: "Dr. Carlos Ramírez",
            correo: "carlos.ramirez@mediconnect.com",
            password: bcrypt.hashSync("medico123", salt),
            rol: "medico",
            especialidad: "Medicina General",
            clinica_id: clinica._id,
            dni: "12345678",
            telefono: "988777666",
            activo: true
        });

        const paciente = await Usuario.create({
            nombre: "Juan Pérez",
            correo: "juan.perez@example.com",
            password: bcrypt.hashSync("paciente123", salt),
            rol: "paciente",
            dni: "87654321",
            telefono: "977666555",
            fecha_nacimiento: new Date("1995-05-20"),
            activo: true
        });

        console.log("Datos de prueba creados correctamente:");
        console.log("- Clínica:", clinica.nombre);
        console.log("- Admin:", admin.correo, "/ password: admin123");
        console.log("- Médico:", medico.correo, "/ password: medico123");
        console.log("- Paciente:", paciente.correo, "/ password: paciente123");

        process.exit(0);
    } catch (error) {
        console.error("Error al poblar datos de prueba:", error.message);
        process.exit(1);
    }
}

seed();