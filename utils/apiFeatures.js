class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // filter
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    //    advanced filter
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne)\b/g,
      (match) => `$${match}`
    );
    queryStr = JSON.parse(queryStr);
    this.query.find(queryStr);
    return this;
  }

  prjection() {
    // fields (projection)
    let fields = this.queryString.fields || "-__v";
    fields = fields.split(",").join(" ");
    this.query = this.query.select(fields);
    return this;
  }

  pagination() {
    if (this.queryString.page) {
      let page = +this.queryString.page;
      let resPerPage = +this.queryString.limit || 2;
      this.query = this.query.limit(resPerPage).skip((page - 1) * resPerPage);
    }
    return this;
  }
  sorting() {
    let sortBy = this.queryString.sort;
    if (sortBy) sortBy.split(",").join(" ");
    else sortBy = { createdAt: -1 };
    this.query = this.query.sort(sortBy);
    return this;
  }
}
module.exports = APIFeatures;
