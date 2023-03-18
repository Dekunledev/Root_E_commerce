require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db/connect");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    mongoose.set("strictQuery", true);
    connectDB(process.env.MONGO_URL);

    app.listen(PORT, console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
