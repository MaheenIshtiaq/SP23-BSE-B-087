const express = require('express');
const Product = require('../models/product');
const router = express.Router();

// Route to add a new product
router.post('/add', async (req, res) => {
  const { name, description, price, quantity, image } = req.body;

  const newProduct = new Product({
    name,
    description,
    price,
    quantity,
    image,
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
