const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Must Have a Name'],
    unique: false,
  },
  description: {
    type: String,
    default: 'unknown Description',
  },
  price: {
    type: Number,
    required: [true, 'Please insert a product Price'],
  },
  date: {
    type: Date,
    required: false,
  },
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;
