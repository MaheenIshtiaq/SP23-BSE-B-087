const express = require('express');
const app = express();
const path = require('path');

// Set up the view engine and views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public','css')));

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Home page route to serve the Tesco website (landing page)
app.get('/', (req, res) => {
    res.render('index'); // This will render the Tesco landing page
});

app.get('/user', (req, res) => {
    // Render the user.ejs template
    res.render('user'); // This will render user.ejs in the views folder
});

// Form page route to display the form
app.get('/form', (req, res) => {
    res.render('form'); // This will render the form submission page
});

app.get('/user', (req, res) => {
    res.render('user'); // This will render the user registration page
});


// POST route to handle form submission
app.post('/submit-form', (req, res) => {
    const { name, email } = req.body;
    console.log('Form submitted:', name, email);
    res.send('Form submitted successfully!');
});

// Start the server on port 3000
app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
