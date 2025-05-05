const bycrypt = require("bcrypt");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
  registerValidation,
  loginValidation,
} = require("../validations/authValidations.js");

class UsersController {
  constructor(userService) {
    this.userService = userService;
  }

  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      const { error } = registerValidation.validate(req.body);
      if (error) {
        return next(createError(400, error.details[0].message));
      }

      const existingUser = await this.userService.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bycrypt.hash(password, 10);
      if (!hashedPassword) {
        return next(createError(500, "Password hashing failed"));
      }
      const newUserData = {
        username,
        email,
        password: hashedPassword,
      };

      const newUser = await this.userService.create(newUserData);

      if (!newUser) {
        return next(createError(400, "User registration failed"));
      }

      res.status(201).json({
        message: "User registered successfully",
        data: newUser,
      });

    } catch (error) {
      next(error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const { error } = loginValidation.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const user = await this.userService.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const isPasswordValid = await bycrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );
      if (!token) {
        return res.status(500).json({ error: "Token generation failed" });
      }
      res.status(200).json({
        message: "Login successful",
        data: user,
        accessToken: token,
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UsersController;
