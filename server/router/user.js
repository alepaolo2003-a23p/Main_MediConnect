const express = require("express");
const UserController = require("../controllers/user");
const ensureAuth = require("../middlewares/authenticated");
const upload = require("../middlewares/multer");

const api = express.Router();

api.get("/user/me", ensureAuth, UserController.getMe);
api.get("/users", ensureAuth, UserController.getUsers);
api.post("/user", ensureAuth, upload.single("foto"), UserController.createUser);
api.put("/users/:id", ensureAuth, upload.single("foto"), UserController.updateUser);
api.delete("/users/:id", ensureAuth, UserController.deleteUser);

module.exports = api;