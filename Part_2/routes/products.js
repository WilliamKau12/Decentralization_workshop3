const express = require('express');
const router = express.Router();

// Sample data for demonstration
let products = [
    { id: 1, name: 'Laptop', description: 'High-end laptop', price: 1200, category: 'Electronics', inStock: true },
    { id: 2, name: 'Phone', description: 'Smartphone with great camera', price: 800, category: 'Electronics', inStock: true },
    { id: 3, name: 'Shirt', description: 'Cotton shirt', price: 30, category: 'Apparel', inStock: false },
];

// GET /products - Get all products, with optional filters
router.get('/', (req, res) => {
    const { category, inStock } = req.query;
    
    let filteredProducts = products;

    if (category) {
        filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
    }
    if (inStock) {
        const inStockBoolean = inStock === 'true';
        filteredProducts = filteredProducts.filter(product => product.inStock === inStockBoolean);
    }

    res.json(filteredProducts);
});

// GET /products/:id - Get a product by ID
router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
});

// POST /products - Add a new product
router.post('/', (req, res) => {
    const { name, description, price, category, inStock } = req.body;

    if (!name || !description || !price || !category || inStock === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newProduct = {
        id: products.length + 1,
        name,
        description,
        price,
        category,
        inStock,
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// PUT /products/:id - Update an existing product
router.put('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, category, inStock } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (inStock !== undefined) product.inStock = inStock;

    res.json(product);
});

// DELETE /products/:id - Delete a product
router.delete('/:id', (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    products.splice(index, 1);
    res.json({ message: 'Product deleted successfully' });
});

module.exports = router;
