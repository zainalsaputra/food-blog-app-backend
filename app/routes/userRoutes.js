const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/usersController.js");
const UserSchema = require("../models/usersModel.js");

const userController = new UsersController(UserSchema);

router.post("/register", userController.register.bind(userController));
router.post("/login", userController.login.bind(userController));
router.get("/user/:id", userController.getUserById.bind(userController));

module.exports = router;
