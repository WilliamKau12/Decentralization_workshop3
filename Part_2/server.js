const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');  // Import cart route

const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Product routes
app.use('/products', productRoutes);

// Order routes
app.use('/orders', orderRoutes);

// Cart routes
app.use('/cart', cartRoutes);  // Use cart route

app.listen(PORT, () => {
    console.log(`E-commerce API running on http://localhost:${PORT}`);
});
