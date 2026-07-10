const HistoriaClinica = require("../models/HistoriaClinica");
const Cita = require("../models/Cita");

// RF-15: médico registra notas clínicas de una cita atendida
async function createNota(req, res) {
    try {
        const medico_id = req.user_id;
        const { cita_id, paciente_id, motivo_consulta, diagnostico, tratamiento, observaciones } = req.body;

        if (!cita_id || !paciente_id) {
            return res.status(400).send({ msg: "Faltan campos obligatorios: cita_id, paciente_id" });
        }

        const cita = await Cita.findById(cita_id);
        if (!cita) {
            return res.status(404).send({ msg: "Cita no encontrada" });
        }

        const nota = new HistoriaClinica({
            cita_id,
            paciente_id,
            medico_id,
            motivo_consulta,
            diagnostico,
            tratamiento,
            observaciones
        });

        const notaSaved = await nota.save();
        res.status(201).send({ msg: "Nota clínica registrada correctamente", nota: notaSaved });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al registrar la nota clínica" });
    }
}

// RF-16: médico ve historial de notas clínicas de un paciente
async function getHistorialPaciente(req, res) {
    try {
        const { paciente_id } = req.params;
        const historial = await HistoriaClinica.find({ paciente_id })
            .populate("medico_id", "nombre especialidad")
            .sort({ fecha: -1 });

        res.status(200).send({ historial });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al obtener el historial clínico" });
    }
}

// RF-17: paciente ve sus propias notas clínicas
async function getMisNotas(req, res) {
    try {
        const paciente_id = req.user_id;
        const notas = await HistoriaClinica.find({ paciente_id })
            .populate("medico_id", "nombre especialidad")
            .sort({ fecha: -1 });

        res.status(200).send({ notas });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al obtener tus notas clínicas" });
    }
}

module.exports = {
    createNota,
    getHistorialPaciente,
    getMisNotas
};