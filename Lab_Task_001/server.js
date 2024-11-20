const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/submit-form', (req, res) => {
    const { name, email } = req.body;
    console.log('Form submitted:', name, email);
    res.send('Form submitted successfully');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
