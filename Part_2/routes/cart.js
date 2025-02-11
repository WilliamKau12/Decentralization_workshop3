const express = require('express');
const router = express.Router();

// Sample data for products (replace with a database in production)
let products = [
    { id: 1, name: 'Laptop', price: 1200, category: 'Electronics', inStock: true },
    { id: 2, name: 'Phone', price: 800, category: 'Electronics', inStock: true },
    { id: 3, name: 'Shirt', price: 30, category: 'Apparel', inStock: false },
];

// Sample cart data
let carts = {};  // Keyed by userId, value is the cart object

// POST /cart/:userId - Add a product to the user's cart
router.post('/:userId', (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ message: `Product with ID ${productId} not found` });
    }
    if (!product.inStock) {
        return res.status(400).json({ message: `Product ${product.name} is out of stock` });
    }

    // Initialize cart if it doesn't exist for the user
    if (!carts[userId]) {
        carts[userId] = { items: [], totalPrice: 0 };
    }

    // Check if the product already exists in the cart
    const existingItem = carts[userId].items.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        carts[userId].items.push({ productId, name: product.name, quantity, price: product.price });
    }

    // Recalculate total price
    carts[userId].totalPrice = carts[userId].items.reduce((total, item) => total + (item.quantity * item.price), 0);

    res.status(201).json(carts[userId]);
});

// GET /cart/:userId - Get the user's shopping cart
router.get('/:userId', (req, res) => {
    const { userId } = req.params;

    if (!carts[userId]) {
        return res.status(404).json({ message: `No cart found for user with ID ${userId}` });
    }

    res.json(carts[userId]);
});

// DELETE /cart/:userId/item/:productId - Remove a specific product from the cart
router.delete('/:userId/item/:productId', (req, res) => {
    const { userId, productId } = req.params;

    if (!carts[userId]) {
        return res.status(404).json({ message: `No cart found for user with ID ${userId}` });
    }

    const itemIndex = carts[userId].items.findIndex(item => item.productId === parseInt(productId));
    if (itemIndex === -1) {
        return res.status(404).json({ message: `Product with ID ${productId} not found in the cart` });
    }

    // Remove the product from the cart
    carts[userId].items.splice(itemIndex, 1);

    // Recalculate total price
    carts[userId].totalPrice = carts[userId].items.reduce((total, item) => total + (item.quantity * item.price), 0);

    res.json(carts[userId]);
});

module.exports = router;
