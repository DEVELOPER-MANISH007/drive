const express = require("express");
const { body, validationResult } = require("express-validator");
const userModel = require("../Models/user.model");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  [
    body("email").trim().isEmail().isLength({ min: 10 }),
    body("password").trim().isLength({ min: 6 }),
    body("username").trim().isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
        message: "Validation Failed",
      });
    }
    // Success response (aap yahan apna logic likh sakte hain)
    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    res.redirect('/login');
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  body("email").trim().isEmail().isLength({ min: 10 }),
  body("password").trim().isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: errors.array(), message: "Validation Failed" });
    }

    const { email, password } = req.body;
    const User = await userModel.findOne({ email: email });
    if (!User) {
      return res
        .status(400)
        .json({ message: "UserName or password is incorrect" });
    }
    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "UserName or password is incorrect" });
    }

    const token = jwt.sign(
      {
        id: User._id,
        username: User.username,
        email: User.email,
      },
      process.env.JWT_SECRET || "your-secret-key"
    );
    res.cookie("token", token, { httpOnly: true, secure: false }); 
    res.redirect('/home');
  }
);

// Logout route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

module.exports = router;
