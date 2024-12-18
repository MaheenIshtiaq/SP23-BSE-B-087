const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true }, // Storing the image URL or path
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
