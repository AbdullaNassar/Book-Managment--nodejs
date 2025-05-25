const express = require("express");
const bookController = require("../controller/bookController");

const route = express.Router();

route.route("/").get(bookController.getAllBooks).post(bookController.addBokk);
route
  .route("/top5-cheapest")
  .get(bookController.getCheapest, bookController.getAllBooks);
route
  .route("/:id")
  .get(bookController.getBookByID)
  .patch(bookController.editBook)
  .delete(bookController.deleteBook);

module.exports = route;
