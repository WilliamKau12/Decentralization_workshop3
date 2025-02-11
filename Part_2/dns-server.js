const express = require('express');
const app = express();
const PORT = 3002;

// Hardcoded registry (can be improved with a dynamic registry)
const registry = { code: 200, server: "localhost:3001" };

app.get('/getServer', (req, res) => {
    res.json(registry);
});

app.listen(PORT, () => {
    console.log(`DNS Registry running on http://localhost:${PORT}`);
});
