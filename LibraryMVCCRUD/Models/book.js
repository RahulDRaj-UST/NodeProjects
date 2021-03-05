const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema(
  {
    name: { type: String },
    author: { type: String },
    price: { type: Number },
    date: { type: Date, trim: true },
    quantity: { type: Number }
  },
  { versionKey: false }
);

const model = mongoose.model('BookInfo', BookSchema, 'BookInfo');
module.exports = model;
