const express = require("express");
const CitaController = require("../controllers/cita");
const ensureAuth = require("../middlewares/authenticated");
const { verificarPaciente, verificarMedico } = require("../middlewares/roles");

const api = express.Router();

api.post("/citas", ensureAuth, verificarPaciente, CitaController.reservarCita);
api.get("/citas/medico/:medico_id", ensureAuth, CitaController.getCitasMedico);
api.get("/citas/paciente/:paciente_id", ensureAuth, CitaController.getCitasPaciente);
api.put("/citas/:id/estado", ensureAuth, verificarMedico, CitaController.actualizarEstadoCita);
api.put("/citas/:id/cancelar", ensureAuth, verificarPaciente, CitaController.cancelarCita);

module.exports = api;