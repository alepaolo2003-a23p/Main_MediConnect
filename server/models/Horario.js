const mongoose = require("mongoose");

const HorarioSchema = mongoose.Schema({
    medico_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    dias: [{
        dia: Number,
        hora_inicio: String,
        hora_fin: String
    }],
    duracion_cita: Number,
    activo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Horario", HorarioSchema);