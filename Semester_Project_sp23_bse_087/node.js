const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Product = require('./models/Product'); // Assuming you have a Product model

const app = express();
const upload = multer({ dest: 'uploads/' });

mongoose.connect('mongodb://localhost:27017/yourdb', { useNewUrlParser: true, useUnifiedTopology: true });

// POST route to handle form submission
app.post('/add-product', upload.single('product_image'), (req, res) => {
    const { product_name, product_description, product_price, product_quantity } = req.body;
    const product_image = req.file ? req.file.path : null;

    const newProduct = new Product({
        name: product_name,
        description: product_description,
        price: product_price,
        quantity: product_quantity,
        image: product_image
    });

    newProduct.save()
        .then(() => res.redirect('/admin-dashboard'))  // Redirect to admin dashboard after saving
        .catch(err => res.status(500).send('Error adding product: ' + err));
});

// Route to view all products (for user view)
app.get('/view-products', (req, res) => {
    Product.find()
        .then(products => res.render('products', { products }))
        .catch(err => res.status(500).send('Error fetching products: ' + err));
});
