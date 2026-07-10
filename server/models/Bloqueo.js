const mongoose = require("mongoose");

const BloqueoSchema = mongoose.Schema({
    medico_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    fecha_inicio: Date,
    fecha_fin: Date,
    motivo: String
}, { timestamps: true });

module.exports = mongoose.model("Bloqueo", BloqueoSchema);