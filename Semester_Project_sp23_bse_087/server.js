const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Create Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/admin_dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  
// MongoDB Schemas and Models
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true }, // Field to store the image filename
});

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },  // User's name
  customerEmail: { type: String, required: true },  // User's email
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],  // Array to store the cart information (products in the cart)
  totalBill: { type: Number, required: true },  // Total bill for the order
  status: { type: String, required: true, default: 'Pending' },  // Status of the order
  createdAt: { type: Date, default: Date.now }  // Timestamp of when the order was created
});


const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Set the folder where the files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Name the file based on the timestamp
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, or PNG files are allowed!'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },  // Limit to 10MB
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  orderId: { type: String, unique: true },
});

// User model
const User = mongoose.model('User', userSchema);

// Register route
app.post('/api/register', async (req, res) => {
  try {
      const { username, fullName, email, password } = req.body;

      // Check if the username or email already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
          return res.status(400).json({ success: false, message: 'Username or Email already exists.' });
      }

      // Create a new user
      const orderId = 'ORD' + Math.random().toString(36).substr(2, 9); // Generate a unique order ID
      const newUser = new User({
          username,
          fullName,
          email,
          password, // Make sure to hash passwords in a real-world app
          orderId,
      });

      // Save the new user to the database
      await newUser.save();
      res.status(201).json({ success: true, message: 'User registered successfully!' });

  } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
// Routes

// Add a new product with image
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    const image = req.file ? req.file.filename : null;

    // Validate if image is uploaded
    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const product = new Product({
      name,
      description,
      price,
      quantity,
      image,  // Store the image filename in the database
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Delete a product by ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

// Add an order
app.post('/api/orders', async (req, res) => {
  const { customerName, customerEmail, cart } = req.body;

  // Simple validation
  if (!customerName || !customerEmail || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  try {
    // Calculate total bill
    let totalBill = 0;
    for (const item of cart) {
      totalBill += item.quantity * item.price;
    }

    // Create the order object
    const newOrder = new Order({
      customerName,
      customerEmail,
      cart,
      totalBill,
      status: 'Pending',  // Initial order status
    });

    // Save the order to the database
    await newOrder.save();

    // Respond with the created order
    res.status(201).json(newOrder);

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();  // Fetch all orders from the database
    res.status(200).json(orders);  // Respond with the list of orders
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
