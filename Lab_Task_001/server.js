const express = require('express');
const app = express();
const path = require('path');

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Body parser for POST data
app.use(express.urlencoded({ extended: true }));

// Route for the main page
app.get('/', (req, res) => {
    res.render('index');
});

// Handle form submission (just logging for now)
app.post('/submit-form', (req, res) => {
    const { name, email } = req.body;
    console.log('Form submitted:', name, email);
    res.send('Form submitted successfully');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
