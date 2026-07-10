const express = require("express");
const ClinicaController = require("../controllers/clinica");
const ensureAuth = require("../middlewares/authenticated");
const { verificarAdmin } = require("../middlewares/roles");

const api = express.Router();

api.post("/clinicas", ensureAuth, verificarAdmin, ClinicaController.createClinica);
api.get("/clinicas", ensureAuth, ClinicaController.getClinicas);
api.get("/clinicas/:id", ensureAuth, ClinicaController.getClinica);
api.put("/clinicas/:id", ensureAuth, verificarAdmin, ClinicaController.updateClinica);
api.delete("/clinicas/:id", ensureAuth, verificarAdmin, ClinicaController.deleteClinica);

module.exports = api;