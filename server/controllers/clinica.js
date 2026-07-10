const Clinica = require("../models/Clinica");

async function createClinica(req, res) {
    try {
        const { nombre, direccion, telefono, correo } = req.body;

        if (!nombre) {
            return res.status(400).send({ msg: "El nombre de la clínica es obligatorio" });
        }

        const clinica = new Clinica({
            nombre,
            direccion,
            telefono,
            correo,
            activo: true
        });

        const clinicaSaved = await clinica.save();
        res.status(201).send({ msg: "Clínica creada correctamente", clinica: clinicaSaved });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al crear la clínica" });
    }
}

async function getClinicas(req, res) {
    try {
        const { active } = req.query;
        let filtro = {};
        
        if (active !== undefined) {
            filtro.activo = active === "true";
        }

        const clinicas = await Clinica.find(filtro);
        res.status(200).send({ clinicas });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al obtener las clínicas" });
    }
}

async function getClinica(req, res) {
    try {
        const { id } = req.params;
        const clinica = await Clinica.findById(id);

        if (!clinica) {
            return res.status(404).send({ msg: "Clínica no encontrada" });
        }

        res.status(200).send({ clinica });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al obtener la clínica" });
    }
}

async function updateClinica(req, res) {
    try {
        const { id } = req.params;
        const clinicaData = { ...req.body };

        const updatedClinica = await Clinica.findByIdAndUpdate(id, clinicaData, { new: true });

        if (!updatedClinica) {
            return res.status(404).send({ msg: "Clínica no encontrada" });
        }

        res.status(200).send({ msg: "Clínica actualizada correctamente", clinica: updatedClinica });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al actualizar la clínica" });
    }
}

async function deleteClinica(req, res) {
    try {
        const { id } = req.params;

        const deletedClinica = await Clinica.findByIdAndDelete(id);

        if (!deletedClinica) {
            return res.status(404).send({ msg: "Clínica no encontrada" });
        }

        res.status(200).send({ msg: "Clínica eliminada correctamente", clinica: deletedClinica });

    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error al eliminar la clínica" });
    }
}

module.exports = {
    createClinica,
    getClinicas,
    getClinica,
    updateClinica,
    deleteClinica
};