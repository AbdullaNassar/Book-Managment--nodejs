const express = require("express");
const Book = require("../models/bookModel");

exports.getAllBooks = async function (req, res) {
  try {
    // filter
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    //    advanced filter
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne)\b/g,
      (match) => `$${match}`
    );
    queryStr = JSON.parse(queryStr);
    let query = Book.find(queryStr);

    // fields (projection)
    let fields = req.query.fields || "-__v";
    fields = fields.split(",").join(" ");
    query = query.select(fields);

    // page
    if (req.query.page) {
      let page = +req.query.page;
      let resPerPage = +req.query.limit || 2;
      console.log(page, resPerPage);
      query = query.limit(resPerPage).skip((page - 1) * resPerPage);
    }

    // sort
    let sortBy = req.query.sort;
    if (sortBy) sortBy.split(",").join(" ");
    else sortBy = { createdAt: -1 };
    query = query.sort(sortBy);

    // execute the query
    const data = await query;

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
