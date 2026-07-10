const mongoose = require("mongoose");

const ClinicaSchema = mongoose.Schema({
    nombre: { type: String, required: true },
    direccion: String,
    telefono: String,
    correo: String,
    activo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Clinica", ClinicaSchema);