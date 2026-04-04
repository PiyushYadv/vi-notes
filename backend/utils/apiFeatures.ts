import { Query } from "mongoose";

class APIFeatures<T> {
  query: Query<T[], T>;
  queryString: Record<string, any>;

  constructor(query: Query<T[], T>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ["sort", "fields", "limit", "page"];

    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy = (this.queryString.sort as string).split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fields = (this.queryString.fields as string).split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate(): this {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
