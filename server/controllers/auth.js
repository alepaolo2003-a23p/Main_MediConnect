const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const jwt = require("../utils/jwt");

async function register(req, res) {
    const { nombre, correo, password, dni, telefono, fecha_nacimiento } = req.body;

    if (!nombre) return res.status(400).send({ msg: "El nombre es obligatorio" });
    if (!correo) return res.status(400).send({ msg: "El correo es obligatorio" });
    if (!password) return res.status(400).send({ msg: "La contraseña es obligatoria" });

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const usuario = new Usuario({
        nombre,
        correo: correo.toLowerCase(),
        password: hashPassword,
        rol: "paciente",
        dni,
        telefono,
        fecha_nacimiento,
        activo: true
    });

    usuario.save((error, usuarioStorage) => {
        if (error) {
            return res.status(400).send({ msg: "Error al crear el usuario" });
        } else {
            return res.status(200).send(usuarioStorage);
        }
    });
}

function login(req, res) {
    const { correo, password } = req.body;

    if (!correo) return res.status(400).send({ msg: "El correo es obligatorio" });
    if (!password) return res.status(400).send({ msg: "La contraseña es obligatoria" });

    const correoLowerCase = correo.toLowerCase();

    Usuario.findOne({ correo: correoLowerCase }, (error, usuarioStorage) => {
        if (error) {
            res.status(500).send({ msg: "Error del servidor" });
        } else if (!usuarioStorage) {
            res.status(400).send({ msg: "Usuario no encontrado" });
        } else {
            bcrypt.compare(password, usuarioStorage.password, (error, check) => {
                if (error) {
                    res.status(500).send({ msg: "Error del servidor" });
                } else if (!check) {
                    res.status(400).send({ msg: "Contraseña incorrecta" });
                } else if (!usuarioStorage.activo) {
                    res.status(401).send({ msg: "Usuario no autorizado o no activo" });
                } else {
                    res.status(200).send({
                        msg: "Login correcto",
                        access: jwt.createAccessToken(usuarioStorage),
                        refresh: jwt.createRefreshToken(usuarioStorage),
                        usuario: {
                            _id: usuarioStorage._id,
                            nombre: usuarioStorage.nombre,
                            correo: usuarioStorage.correo,
                            rol: usuarioStorage.rol
                        }
                    });
                }
            });
        }
    });
}

async function refreshAccessToken(req, res) {
    const { token } = req.body;

    if (!token) return res.status(400).send({ msg: "El token es obligatorio" });

    try {
        const { user_id } = jwt.verifyToken(token);
        const usuarioStorage = await Usuario.findOne({ _id: user_id });

        if (!usuarioStorage) {
            return res.status(404).send({ msg: "Usuario no encontrado" });
        }

        res.status(200).send({
            accessToken: jwt.createAccessToken(usuarioStorage)
        });

    } catch (error) {
        res.status(401).send({ msg: "Token inválido o expirado", error: error.message });
    }
}

module.exports = {
    register,
    login,
    refreshAccessToken,
};