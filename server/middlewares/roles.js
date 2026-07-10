const Usuario = require("../models/Usuario");

async function verificarAdmin(req, res, next) {
    try {
        const usuario = await Usuario.findById(req.user_id);
        console.log("🔍 Rol del usuario:", usuario?.rol);
        if (!usuario || usuario.rol !== 'administrador') {
            return res.status(403).send({ msg: "Solo administradores pueden realizar esta acción" });
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        return res.status(500).send({ msg: "Error al verificar rol" });
    }
}

async function verificarMedico(req, res, next) {
    try {
        const usuario = await Usuario.findById(req.user_id);
        if (!usuario || usuario.rol !== 'medico') {
            return res.status(403).send({ msg: "Solo médicos pueden realizar esta acción" });
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        return res.status(500).send({ msg: "Error al verificar rol" });
    }
}

async function verificarPaciente(req, res, next) {
    try {
        const usuario = await Usuario.findById(req.user_id);
        if (!usuario || usuario.rol !== 'paciente') {
            return res.status(403).send({ msg: "Solo pacientes pueden realizar esta acción" });
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        return res.status(500).send({ msg: "Error al verificar rol" });
    }
}

module.exports = {
    verificarAdmin,
    verificarMedico,
    verificarPaciente
};