const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/usersModel.js");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

// new user register
router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.send({
        success: false,
        message: "User already exists",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      role: "Customer",
      status: "Active",
    });

    res.send({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
      data: null,
    });
  }
});

// user login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
        data: null,
      });
    } else {
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password,
      );

      if (!isPasswordValid) {
        return res.send({
          success: false,
          message: "Invalid password",
          data: null,
        });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.json({
        success: true,
        message: "User logged in successfully",
        data: token,
      });
    }
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
      data: null,
    });
  }
});

// validate token for authorization
router.post("/validate-token", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
        data: null,
      });
    }
    res.send({
      success: true,
      message: "Token is valid",
      data: null,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
      data: null,
    });
  }
});

module.exports = router;
