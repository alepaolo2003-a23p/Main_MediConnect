const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { API_VERSION } = require("./constants");

const app = express();

const AuthRoutes = require("./router/auth");
const UserRoutes = require("./router/user");
const ClinicaRoutes = require("./router/clinica");
const MedicoRoutes = require("./router/medico");
const CitaRoutes = require("./router/cita");
const HistoriaClinicaRoutes = require("./router/historiaClinica");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("uploads"));
app.use(cors({ origin: "http://localhost:3000" }));

app.use(`/api/${API_VERSION}`, AuthRoutes);
app.use(`/api/${API_VERSION}`, UserRoutes);
app.use(`/api/${API_VERSION}`, ClinicaRoutes);
app.use(`/api/${API_VERSION}`, MedicoRoutes);
app.use(`/api/${API_VERSION}`, CitaRoutes);
app.use(`/api/${API_VERSION}`, HistoriaClinicaRoutes);

module.exports = app;