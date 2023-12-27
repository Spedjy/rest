const express = require('express');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json());

const User = require('./models/user');
const Product = require('./models/product');
const auth = require('./middlewares/auth')
const isAdmin = require('./middlewares/isAdmin')

app.post('/users/register', async (req, res) =>{
    const user = await User.register(req.body);
    res.status(201).json(user);
})

app.post('/users/login', async (req, res) =>{
    const user = await User.login(req.body);
    if (!user) return res.status(401).send('Неправильная почта или пароль');

    const token = jwt.sign({ id: user.id, role: user.role}, process.env.SECRET_KEY, {expiresIn: '1h'});
    res.json({ token });
});

app.post('/products', auth, isAdmin, async (req, res) => {
    try {
        await productController.createProduct(req, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/products/:id', auth, isAdmin, async (req, res) => {
    try {
        await productController.updateProduct(req, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/products/:id', auth, isAdmin, async (req, res) => {
    try {
        await productController.deleteProduct(req, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/products', async (req, res) => {
    const products = await Product.getAll();
    res.json(products);
});

app.get('/products/:id', async (req, res) => {
    const product = await Product.getById(req.params.id);
    if (!product) return res.status(404).send('Данный продукт не найден');
    res.json(product);
});

app.post('/products', async (req, res) => {
    const newProduct = await Product.add(req.body.name, req.body.price);
    res.status(201).json({ id: newProduct, name: req.body.name, price: req.body.price });
});

app.put('/products/:id', async (req, res) => {
    const updated = await Product.update(req.params.id, req.body.name, req.body.price);
    if (updated === 0) return res.status(404).send('Данный продукт не найден');
    res.json({ id: req.params.id, name: req.body.name, price: req.body.price });
});

app.delete('/products/:id', async (req, res) => {
    const deleted = await Product.delete(req.params.id);
    if (deleted === 0) return res.status(404).send('Данный продукт не найден');
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту: ${port}`);
});