const express = require("express");
const Book = require("../models/bookModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getCheapest = function (req, res, next) {
  req.query.sort = "price";
  req.query.limit = 5;
  req.query.page = 1;
  next();
};

exports.getAllBooks = async function (req, res) {
  try {
    const features = new APIFeatures(Book.find(), req.query)
      .filter()
      .prjection()
      .pagination()
      .sorting();
    // execute the query
    const data = await features.query;

    // send response
    res.status(200).json({
      status: "success",
      results: data.length,
      data,
    });
  } catch (err) {
    console.log("errrrrr");
    console.log(err);
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.addBokk = async function (req, res) {
  try {
    const data = await Book.create(req.body);
    res.status(200).json({
      status: "sucess",
      data,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
    console.log(err);
    console.log("cant add book");
  }
};

exports.getBookByID = async function (req, res) {
  const id = req.params.id;

  try {
    const data = await Book.findById(id);
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
    });
  }
};

exports.editBook = async function (req, res) {
  const id = req.params.id;
  try {
    const data = await Book.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    // console.log(data);
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.deleteBook = async function (req, res) {
  const id = req.params.id;
  try {
    const data = await Book.findByIdAndDelete(id);
    if (!data) {
      throw new Error("there is no book with this id");
    }
    console.log(data);
    res.status(200).json({
      status: "deleted succssfully",
      data,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
