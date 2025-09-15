const mongoose = require("mongoose");
require("dotenv").config();

function    connectDB() {
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB connected");
})
}

module.exports = connectDB;