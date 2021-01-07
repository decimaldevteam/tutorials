const express = require('express');
const app = express();
const database = require('./database.json');

// Simple test api
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Sending simple json response with setting status
app.get('/json', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

// Simple api endpoint to get information of the product by endpoint
app.get('/product/:id', (req, res) => {
    let id = req.params.id;
    let product = database.find(x => x.id == id);

    if(product){
        res.status(200).json({ message: 'success', data: product });
    }else {
        res.status(404).json({ message: 'not found', data: null });
    }
});

// The same old way but using queries!
app.get('/products', (req, res) => {
    let id = req.query.id;
    let product = database.find(x => x.id == id);

    if(product){
        res.status(200).json({ message: 'success', data: product });
    }else {
        res.status(404).json({ message: 'not found', data: null });
    }
});

app.listen(3000, () => {
    console.log('Listening on port 3000!'); // Simple callback
})