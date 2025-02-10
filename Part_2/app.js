const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/products'); // Import routes
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Use routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

console.log(productRoutes);
console.log(orderRoutes);
console.log(cartRoutes);