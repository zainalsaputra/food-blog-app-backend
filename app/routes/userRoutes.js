const express = require("express");
const router = express.Router();

const bindControllerMethods = require("../utils/bindControllerMethods.js");
const UsersController = require("../controllers/usersController.js");
const UserSchema = require("../models/usersModel.js");

const userController = bindControllerMethods(new UsersController(UserSchema));

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/user/:id", userController.getUserById);

module.exports = router;
