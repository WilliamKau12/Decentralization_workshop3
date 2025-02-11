const express = require('express');
const router = express.Router();

// Sample data for products
let products = [
    { id: 1, name: 'Laptop', price: 1200, category: 'Electronics', inStock: true },
    { id: 2, name: 'Phone', price: 800, category: 'Electronics', inStock: true },
    { id: 3, name: 'Shirt', price: 30, category: 'Apparel', inStock: false },
];

// Sample data for orders
let orders = [];

// POST /orders - Create a new order
router.post('/', (req, res) => {
    const { userId, productsOrdered } = req.body;
    
    if (!userId || !Array.isArray(productsOrdered) || productsOrdered.length === 0) {
        return res.status(400).json({ message: 'User ID and products are required' });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of productsOrdered) {
        const product = products.find(p => p.id === item.productId);
        if (!product) {
            return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
        }
        if (!product.inStock) {
            return res.status(400).json({ message: `Product ${product.name} is out of stock` });
        }
        
        const itemTotal = product.price * item.quantity;
        totalPrice += itemTotal;
        orderItems.push({
            productId: product.id,
            name: product.name,
            quantity: item.quantity,
            total: itemTotal
        });
    }

    const orderId = orders.length + 1;  
    const order = {
        orderId,
        userId,
        productsOrdered: orderItems,
        totalPrice,
        status: 'Pending'
    };

    orders.push(order);

    res.status(201).json(order);
});

// GET /orders/:userId - Get all orders of a specific user
router.get('/:userId', (req, res) => {
    const userOrders = orders.filter(order => order.userId === parseInt(req.params.userId));
    if (userOrders.length === 0) {
        return res.status(404).json({ message: 'No orders found for this user' });
    }
    res.json(userOrders);
});

module.exports = router;
