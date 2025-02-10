const calculateCartTotal = (cartItems, products) => {
    return cartItems.reduce((total, item) => {
        const product = products.find(p => p.id === item.productId);
        return total + (product.price * item.quantity);
    }, 0);
};

module.exports = {
    calculateCartTotal
};