const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Define routes
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.post('/', productsController.createProduct);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

// Export the router
module.exports = router;