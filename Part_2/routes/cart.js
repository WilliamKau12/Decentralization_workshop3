const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');
const readDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');


// Sample data for products 
let products = [
    { id: 1, name: 'Laptop', price: 1200, category: 'Electronics', inStock: true },
    { id: 2, name: 'Phone', price: 800, category: 'Electronics', inStock: true },
    { id: 3, name: 'Shirt', price: 30, category: 'Apparel', inStock: false },
];

// Sample cart data
let carts = {};  // Keyed by userId, value is the cart object

// Sample cart route example
router.post('/:userId', (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    const db = readDB();
    const product = db.products.find(p => p.id === productId);

    if (!product || !product.inStock) {
        return res.status(400).json({ message: 'Product not available' });
    }

    if (!db.carts[userId]) {
        db.carts[userId] = { items: [], totalPrice: 0 };
    }

    const existingItem = db.carts[userId].items.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        db.carts[userId].items.push({ productId, name: product.name, quantity, price: product.price });
    }

    db.carts[userId].totalPrice = db.carts[userId].items.reduce((total, item) => total + item.quantity * item.price, 0);

    writeDB(db);
    res.status(201).json(db.carts[userId]);
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
