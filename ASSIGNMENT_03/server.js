const express = require('express');
const path = require('path');
const app = express();

// Serve static files (CSS, JS, etc.) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve tesco_005.html at the root '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'views', 'tesco_005.html'));
});

// Route to serve portfolio page at '/portfolio'
app.get('/portfolio', (req, res) => {
    res.sendFile(path.join(__dirname,'views', 'index.html'));
});

// Start server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
