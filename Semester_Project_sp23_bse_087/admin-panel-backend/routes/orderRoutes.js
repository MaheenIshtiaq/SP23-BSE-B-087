const express = require('express');
const Order = require('../models/order');
const router = express.Router();

// Place a new order
router.post('/place', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId').populate('products.productId');
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
