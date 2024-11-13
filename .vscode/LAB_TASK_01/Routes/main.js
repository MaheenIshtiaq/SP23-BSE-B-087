// routes/main.js
const express = require('express');
const router = express.Router();

// Route to render the layout page
router.get('/', (req, res) => {
    res.render('layout');
});

module.exports = router;
