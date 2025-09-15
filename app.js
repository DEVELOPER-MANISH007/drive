const express = require("express");
const path = require("path");
const userRouter = require("./Routes/user.routes");
const { query, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const indexRouter = require("./Routes/index.routes");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// ✅ Final CSP Middleware (keep only this one)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self' blob: data:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdn.jsdelivr.net/npm/flowbite",
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https://cdnjs.cloudflare.com",
      "connect-src 'self' https:",
      "frame-src 'self'",
      "object-src 'none'"
    ].join("; ")
  );
  next();
});

// ✅ Connect DB
connectDB();

// ✅ Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/", userRouter);
app.use("/", indexRouter);

// ✅ Local dev server (Vercel will use api/index.js instead)
if (!process.env.VERCEL) {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

module.exports = app;
