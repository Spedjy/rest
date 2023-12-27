const express = require('express'); // Импортируем библиотеку Express
const app = express(); // Создаем приложение Express
const port = 3000; // Порт на котором будет работать наш сервер

const bcrypt = require('bcrypt'); // Импортируем библиотеку bcrypt для хеширования паролей
const jwt = require('jsonwebtoken'); // Импортируем библиотеку jsonwebtoken для работы с JWT токенами

app.use(express.json()); // Добавляем middleware для парсинга JSON запросов

const User = require('./models/user'); // Импортируем модель User
const Product = require('./models/product'); // Импортируем модель Product
const auth = require('./middlewares/auth'); // Импортируем middleware для аутентификации
const isAdmin = require('./middlewares/isAdmin'); // Импортируем middleware для проверки администратора

// Регистрация нового пользователя
app.post('/users/register', async (req, res) => {
    const user = await User.register(req.body); // Регистрируем нового пользователя
    res.status(201).json(user); // Отправляем статус 201 и пользователя в ответе
});

// Авторизация пользователя
app.post('/users/login', async (req, res) => {
    const user = await User.login(req.body); // Авторизуем пользователя
    if (!user) return res.status(401).send('Неправильная почта или пароль'); // Если пользователь не найден, отправляем статус 401

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' }); // Генерируем JWT токен
    res.json({ token }); // Отправляем токен в ответе
});

// Добавление нового продукта
app.post('/products', auth, isAdmin, async (req, res) => { // Добавляем middleware для аутентификации и проверки администратора
    try {
        await productController.createProduct(req, res); // Вызываем контроллер для создания продукта
    } catch (error) {
        res.status(500).json({ message: error.message }); // Если произошла ошибка, отправляем статус 500 и сообщение об ошибке
    }
});

// Обновление информации о продукте
app.put('/products/:id', auth, isAdmin, async (req, res) => { // Добавляем middleware для аутентификации и проверки администратора
    try {
        await productController.updateProduct(req, res); // Вызываем контроллер для обновления продукта
    } catch (error) {
        res.status(500).json({ message: error.message }); // Если произошла ошибка, отправляем статус 500 и сообщение об ошибке
    }
});

// Удаление продукта
app.delete('/products/:id', auth, isAdmin, async (req, res) => { // Добавляем middleware для аутентификации и проверки администратора
    try {
        await productController.deleteProduct(req, res); // Вызываем контроллер для удаления продукта
    } catch (error) {
        res.status(500).json({ message: error.message }); // Если произошла ошибка, отправляем статус 500 и сообщение об ошибке
    }
});
app.get('/products', async (req, res) => { // Получение списка всех продуктов
    const products = await Product.getAll(); // Запрашиваем список всех продуктов
    res.json(products); // Отправляем список продуктов в ответе
});

app.get('/products/:id', async (req, res) => { // Получение информации о конкретном продукте
    const product = await Product.getById(req.params.id); // Запрашиваем информацию о продукте по его ID
    if (!product) return res.status(404).send('Данный продукт не найден'); // Если продукт не найден, отправляем статус 404
    res.json(product); // Отправляем информацию о продукте в ответе
});

app.listen(port, () => { // Запускаем сервер на определенном порту
    console.log(`Сервер запущен на порту: ${port}`); // Выводим сообщение в консоль
});