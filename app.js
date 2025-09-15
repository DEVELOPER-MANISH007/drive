const express = require("express");
const app = express();
const path = require("path");
const userRouter = require("./Routes/user.routes");
const { query, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const indexRouter = require("./Routes/index.routes");


const connectDB = require("./config/db");
connectDB();
require("dotenv").config();




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/", userRouter);
app.use("/", indexRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
