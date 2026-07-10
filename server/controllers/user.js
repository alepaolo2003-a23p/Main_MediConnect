const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const image = require("../utils/image");

async function getMe(req, res) {
    try {
        const user_id = req.user_id;
        const response = await Usuario.findById(user_id).populate('clinica_id');

        if (!response) {
            return res.status(400).send({ msg: "No se ha encontrado usuario" });
        }

        res.status(200).send({ response });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al obtener el usuario" });
    }
}

async function getUsers(req, res) {
    try {
        const { active, rol } = req.query;
        let filtro = {};
        
        if (active !== undefined) {
            filtro.activo = active === "true";
        }
        if (rol) {
            filtro.rol = rol;
        }

        const response = await Usuario.find(filtro).populate('clinica_id');
        res.status(200).send({ response });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al obtener los usuarios" });
    }
}

async function createUser(req, res) {
    try {
        const { nombre, correo, password, rol, dni, telefono, fecha_nacimiento, especialidad, clinica_id } = req.body;
        const file = req.file;

        if (!nombre || !correo || !password || !rol) {
            return res.status(400).send({ msg: "Faltan campos obligatorios" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const avatarName = file ? image.getFileName(file) : null;

        const newUser = new Usuario({
            nombre,
            correo: correo.toLowerCase(),
            password: hashedPassword,
            rol,
            dni,
            telefono,
            fecha_nacimiento,
            especialidad,
            clinica_id,
            activo: true,
            foto: avatarName
        });

        const userSaved = await newUser.save();
        res.status(201).send({
            msg: "Usuario creado correctamente",
            user: userSaved,
            avatarSubido: !!avatarName
        });

    } catch (error) {
        //COLOCAR LO COMENTADO SI HAY PROBLEMAS
        //console.error("ERROR COMPLETO:");
        //console.error(error);

        //res.status(500).send({
        //msg: "Error al crear el usuario",
        //error: error.message
    //});
        console.error(error);
        res.status(500).send({ msg: "Error al crear el usuario" });
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const userData = { ...req.body };

        if (userData.password) {
            const salt = bcrypt.genSaltSync(10);
            userData.password = bcrypt.hashSync(userData.password, salt);
        }

        const file = req.file;
        if (file) {
            userData.foto = image.getFileName(file);
        }

        const updatedUser = await Usuario.findByIdAndUpdate(id, userData, { new: true });

        if (!updatedUser) {
            return res.status(400).send({ msg: "No se ha encontrado usuario" });
        }

        res.status(200).send({ msg: "Actualización correcta", user: updatedUser });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al actualizar el usuario" });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        const deletedUser = await Usuario.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(400).send({ msg: "No se ha encontrado usuario" });
        }

        res.status(200).send({ msg: "Usuario eliminado correctamente", user: deletedUser });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al eliminar el usuario" });
    }
}

module.exports = {
    getMe,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
};