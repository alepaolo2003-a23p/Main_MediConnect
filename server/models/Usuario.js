const mongoose = require("mongoose");

const UsuarioSchema = mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { 
        type: String, 
        enum: ['administrador', 'medico', 'paciente'],
        required: true 
    },
    dni: String,
    telefono: String,
    fecha_nacimiento: Date,
    especialidad: String,
    clinica_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinica' },
    foto: String,
    activo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Usuario", UsuarioSchema);