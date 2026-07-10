const mongoose = require("mongoose");

const CitaSchema = mongoose.Schema({
    paciente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    medico_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    fecha: Date,
    hora: String,
    estado: {
        type: String,
        enum: ['reservada', 'confirmada', 'atendida', 'cancelada', 'no_asistio'],
        default: 'reservada'
    },
    motivo_consulta: String
}, { timestamps: true });

module.exports = mongoose.model("Cita", CitaSchema);