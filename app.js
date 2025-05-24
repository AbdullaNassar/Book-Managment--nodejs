const express = require("express");
const app = express();
const bookRouter = require("./routes/bookRoutes");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

// connected to database
const DB_LOCAL = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB_LOCAL)
  .then((con) => {
    console.log("connected to database succussfully");
  })
  .catch((err) => {
    console.log("error while connected to database");
  });

// general middlewares
app.use(express.json()); //parsing body request
app.use(morgan("dev"));

// routes
app.use("/books", bookRouter);

// listen to the server
app.listen(8000, () => {
  console.log("listening to the server... ");
});
