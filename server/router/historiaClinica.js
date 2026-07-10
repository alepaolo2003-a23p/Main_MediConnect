const express = require("express");
const HistoriaClinicaController = require("../controllers/historiaClinica");
const ensureAuth = require("../middlewares/authenticated");
const { verificarMedico, verificarPaciente } = require("../middlewares/roles");

const api = express.Router();

api.post("/historia-clinica", ensureAuth, verificarMedico, HistoriaClinicaController.createNota);
api.get("/historia-clinica/paciente/:paciente_id", ensureAuth, verificarMedico, HistoriaClinicaController.getHistorialPaciente);
api.get("/historia-clinica/mis-notas", ensureAuth, verificarPaciente, HistoriaClinicaController.getMisNotas);

module.exports = api;