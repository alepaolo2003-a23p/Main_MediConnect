const Usuario = require("../models/Usuario");
const Horario = require("../models/Horario");
const Bloqueo = require("../models/Bloqueo");
const bcrypt = require("bcryptjs");

// RF-02: Administrador registra médico
async function registrarMedico(req, res) {
    try {
        console.log("BODY:", req.body);
        console.log("HEADERS:", req.headers["content-type"]);
        const adminId = req.user_id;
        const { nombre, correo, password, especialidad, clinica_id, dni, telefono, fecha_nacimiento } = req.body;

        if (!nombre || !correo || !password || !especialidad || !clinica_id) {
            return res.status(400).send({ msg: "Faltan campos obligatorios: nombre, correo, password, especialidad, clinica_id" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const medico = new Usuario({
            nombre,
            correo: correo.toLowerCase(),
            password: hashPassword,
            rol: "medico",
            dni,
            telefono,
            fecha_nacimiento,
            especialidad,
            clinica_id,
            activo: true
        });

        const medicoSaved = await medico.save();
        res.status(201).send({ msg: "Médico registrado correctamente", medico: medicoSaved });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al registrar el médico" });
    }
}

// Listar médicos
async function getMedicos(req, res) {
    try {
        const { especialidad, active } = req.query;
        let filtro = { rol: "medico" };

        if (especialidad) {
            filtro.especialidad = especialidad;
        }
        if (active !== undefined) {
            filtro.activo = active === "true";
        }

        const medicos = await Usuario.find(filtro).populate('clinica_id', 'nombre direccion telefono');
        res.status(200).send({ medicos });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al obtener los médicos" });
    }
}

// Obtener médico por ID
async function getMedico(req, res) {
    try {
        const { id } = req.params;
        const medico = await Usuario.findOne({ _id: id, rol: "medico" }).populate('clinica_id');

        if (!medico) {
            return res.status(404).send({ msg: "Médico no encontrado" });
        }

        res.status(200).send({ medico });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al obtener el médico" });
    }
}

// RF-04: Configurar horario semanal
async function configurarHorario(req, res) {
    try {
        const { medico_id, dias, duracion_cita } = req.body;

        if (!medico_id || !dias || !duracion_cita) {
            return res.status(400).send({ msg: "Faltan campos obligatorios: medico_id, dias, duracion_cita" });
        }

        // Verificar que el médico existe
        const medico = await Usuario.findOne({ _id: medico_id, rol: "medico" });
        if (!medico) {
            return res.status(404).send({ msg: "Médico no encontrado" });
        }

        // Verificar si ya tiene horario
        let horario = await Horario.findOne({ medico_id });

        if (horario) {
            // Actualizar horario existente
            horario.dias = dias;
            horario.duracion_cita = duracion_cita;
            horario.activo = true;
            await horario.save();
            return res.status(200).send({ msg: "Horario actualizado correctamente", horario });
        }

        // Crear nuevo horario
        const nuevoHorario = new Horario({
            medico_id,
            dias,
            duracion_cita,
            activo: true
        });

        const horarioSaved = await nuevoHorario.save();
        res.status(201).send({ msg: "Horario configurado correctamente", horario: horarioSaved });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al configurar el horario" });
    }
}

// Obtener horario de un médico
async function getHorario(req, res) {
    try {
        const { medico_id } = req.params;
        const horario = await Horario.findOne({ medico_id, activo: true });

        if (!horario) {
            return res.status(404).send({ msg: "Horario no encontrado para este médico" });
        }

        res.status(200).send({ horario });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al obtener el horario" });
    }
}

// RF-07: Bloquear fechas específicas
async function bloquearFecha(req, res) {
    try {
        const { medico_id, fecha_inicio, fecha_fin, motivo } = req.body;

        if (!medico_id || !fecha_inicio || !fecha_fin) {
            return res.status(400).send({ msg: "Faltan campos obligatorios: medico_id, fecha_inicio, fecha_fin" });
        }

        // Verificar que el médico existe
        const medico = await Usuario.findOne({ _id: medico_id, rol: "medico" });
        if (!medico) {
            return res.status(404).send({ msg: "Médico no encontrado" });
        }

        const bloqueo = new Bloqueo({
            medico_id,
            fecha_inicio,
            fecha_fin,
            motivo: motivo || "Sin motivo especificado"
        });

        const bloqueoSaved = await bloqueo.save();
        res.status(201).send({ msg: "Fecha bloqueada correctamente", bloqueo: bloqueoSaved });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al bloquear la fecha" });
    }
}

// Obtener bloqueos de un médico
async function getBloqueos(req, res) {
    try {
        const { medico_id } = req.params;
        const bloqueos = await Bloqueo.find({ medico_id });

        res.status(200).send({ bloqueos });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al obtener los bloqueos" });
    }
}

// Eliminar bloqueo
async function deleteBloqueo(req, res) {
    try {
        const { id } = req.params;
        const deletedBloqueo = await Bloqueo.findByIdAndDelete(id);

        if (!deletedBloqueo) {
            return res.status(404).send({ msg: "Bloqueo no encontrado" });
        }

        res.status(200).send({ msg: "Bloqueo eliminado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al eliminar el bloqueo" });
    }
}

module.exports = {
    registrarMedico,
    getMedicos,
    getMedico,
    configurarHorario,
    getHorario,
    bloquearFecha,
    getBloqueos,
    deleteBloqueo
};