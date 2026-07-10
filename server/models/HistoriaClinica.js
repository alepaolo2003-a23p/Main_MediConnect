const mongoose = require("mongoose");

const HistoriaClinicaSchema = mongoose.Schema({
    cita_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cita', required: true },
    paciente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    medico_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    motivo_consulta: String,
    diagnostico: String,
    tratamiento: String,
    observaciones: String,
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model("HistoriaClinica", HistoriaClinicaSchema);