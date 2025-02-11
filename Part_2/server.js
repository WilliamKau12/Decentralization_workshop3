const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const productRoutes = require('./routes/products');

const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Product routes
app.use('/products', productRoutes);

app.listen(PORT, () => {
    console.log(`E-commerce API running on http://localhost:${PORT}`);
});
