const Product = require('../models/Product');

const getAllProducts = (req, res) => {
    res.json(Product.getAll());
};

const getProductById = (req, res) => {
    const product = Product.getById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
};

const createProduct = (req, res) => {
    const newProduct = Product.create(req.body);
    res.status(201).json(newProduct);
};

const updateProduct = (req, res) => {
    const updatedProduct = Product.update(req.params.id, req.body);
    if (!updatedProduct) return res.status(404).send('Product not found');
    res.json(updatedProduct);
};

const deleteProduct = (req, res) => {
    const success = Product.delete(req.params.id);
    if (!success) return res.status(404).send('Product not found');
    res.json({ message: 'Product deleted successfully' });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};