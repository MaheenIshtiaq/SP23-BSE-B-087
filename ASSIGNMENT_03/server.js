const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/bootstrap', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'tesco_005.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
