const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index'); 
});

app.get('/form', (req, res) => {
    res.render('form'); 
});

app.post('/submit-form', (req, res) => {
    const { name, email } = req.body; 
    res.send(`Form submitted! Name: ${name}, Email: ${email}`);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
