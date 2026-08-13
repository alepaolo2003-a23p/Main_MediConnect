const express = require("express");
const multer = require("multer"); 
const MedicoController = require("../controllers/medico");
const ensureAuth = require("../middlewares/authenticated");
const upload = require("../middlewares/multer"); 
const { verificarAdmin, verificarMedico } = require("../middlewares/roles"); 

const api = express.Router();

// Registro de médico (RF-02) - solo administrador
api.post("/medicos/registrar", ensureAuth, verificarAdmin,upload.single("foto"), MedicoController.registrarMedico);
api.get("/medicos", ensureAuth, MedicoController.getMedicos);
api.get("/medicos/:id", ensureAuth, MedicoController.getMedico);

// Horario (RF-04)
api.post("/medicos/horario", ensureAuth, verificarMedico, MedicoController.configurarHorario);
api.get("/medicos/horario/:medico_id", ensureAuth, MedicoController.getHorario);

// Bloqueos (RF-07)
api.post("/medicos/bloqueo", ensureAuth, verificarMedico, MedicoController.bloquearFecha);
api.get("/medicos/bloqueos/:medico_id", ensureAuth, MedicoController.getBloqueos);
api.delete("/medicos/bloqueo/:id", ensureAuth, MedicoController.deleteBloqueo);

// Disponibilidad (FEAT)
api.get("/medicos/disponibilidad/:medico_id", ensureAuth, MedicoController.getDisponibilidad);

module.exports = api;
