const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "book must have a name"],
    unique: true,
    trim: true,
  },
  author: {
    type: String,
    default: "unknown",
  },
  pages: {
    type: Number,
  },
  price: {
    type: Number,
    required: [true, "book must have price"],
  },
  availability: {
    type: String,
    enum: {
      values: ["in stock", "out of stock"],
      message: "availability must be (in stock) or (out of stock)",
    },
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
