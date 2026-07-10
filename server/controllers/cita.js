const Cita = require("../models/Cita");
const Usuario = require("../models/Usuario");

// RF-08 y RF-09: paciente reserva un turno
async function reservarCita(req, res) {
    try {
        const paciente_id = req.user_id;
        const { medico_id, fecha, hora, motivo_consulta } = req.body;

        if (!medico_id || !fecha || !hora) {
            return res.status(400).send({ msg: "Faltan campos obligatorios: medico_id, fecha, hora" });
        }

        const medico = await Usuario.findOne({ _id: medico_id, rol: "medico" });
        if (!medico) {
            return res.status(404).send({ msg: "Médico no encontrado" });
        }

        const citaExistente = await Cita.findOne({
            medico_id,
            fecha,
            hora,
            estado: { $in: ["reservada", "confirmada"] }
        });

        if (citaExistente) {
            return res.status(400).send({ msg: "Ese turno ya no está disponible" });
        }

        const cita = new Cita({
            paciente_id,
            medico_id,
            fecha,
            hora,
            motivo_consulta,
            estado: "reservada"
        });

        const citaSaved = await cita.save();
        res.status(201).send({ msg: "Cita reservada correctamente", cita: citaSaved });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al reservar la cita" });
    }
}

// RF-11: agenda diaria/semanal del médico
async function getCitasMedico(req, res) {
    try {
        const { medico_id } = req.params;
        const { desde, hasta } = req.query;
        let filtro = { medico_id };

        if (desde && hasta) {
            filtro.fecha = { $gte: new Date(desde), $lte: new Date(hasta) };
        }

        const citas = await Cita.find(filtro)
            .populate("paciente_id", "nombre correo telefono")
            .sort({ fecha: 1, hora: 1 });

        res.status(200).send({ citas });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al obtener la agenda del médico" });
    }
}

// RF-14: próximas citas + historial del paciente
async function getCitasPaciente(req, res) {
    try {
        const { paciente_id } = req.params;
        const citas = await Cita.find({ paciente_id })
            .populate("medico_id", "nombre especialidad")
            .sort({ fecha: -1, hora: -1 });

        res.status(200).send({ citas });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al obtener las citas del paciente" });
    }
}

// RF-12: médico confirma, atiende o marca no asistida
async function actualizarEstadoCita(req, res) {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const estadosValidos = ["confirmada", "atendida", "no_asistio"];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).send({ msg: "Estado no válido. Use: confirmada, atendida o no_asistio" });
        }

        const cita = await Cita.findByIdAndUpdate(id, { estado }, { new: true });
        if (!cita) {
            return res.status(404).send({ msg: "Cita no encontrada" });
        }

        res.status(200).send({ msg: "Estado de la cita actualizado", cita });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al actualizar el estado de la cita" });
    }
}

// RF-13: paciente cancela con al menos 24 horas de anticipación
async function cancelarCita(req, res) {
    try {
        const { id } = req.params;
        const cita = await Cita.findById(id);

        if (!cita) {
            return res.status(404).send({ msg: "Cita no encontrada" });
        }

        const fechaStr = cita.fecha.toISOString().split("T")[0];
        const fechaHoraCita = new Date(`${fechaStr}T${cita.hora}`);
        const ahora = new Date();
        const diferenciaHoras = (fechaHoraCita - ahora) / (1000 * 60 * 60);

        if (diferenciaHoras < 24) {
            return res.status(400).send({ msg: "Solo se puede cancelar con al menos 24 horas de anticipación" });
        }

        cita.estado = "cancelada";
        await cita.save();

        res.status(200).send({ msg: "Cita cancelada correctamente", cita });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al cancelar la cita" });
    }
}

module.exports = {
    reservarCita,
    getCitasMedico,
    getCitasPaciente,
    actualizarEstadoCita,
    cancelarCita
};