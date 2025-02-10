let products = [];

const Product = {
    getAll: () => products,
    getById: (id) => products.find(p => p.id === id),
    create: (product) => {
        const newProduct = { id: Date.now().toString(), ...product };
        products.push(newProduct);
        return newProduct;
    },
    update: (id, updates) => {
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return null;
        products[index] = { ...products[index], ...updates };
        return products[index];
    },
    delete: (id) => {
        const initialLength = products.length;
        products = products.filter(p => p.id !== id);
        return products.length !== initialLength;
    }
};

module.exports = Product;