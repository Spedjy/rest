const Product = require("../models/products"); // Импортируем класс Product из модели products
const auth = require("../middleware/auth"); // Импортируем middleware auth
const isAdmin = require("../middleware/isAdmin"); // Импортируем middleware isAdmin

exports.getAllProducts = async (req, res) => { // Определяем экспортируемую функцию getAllProducts для получения всех продуктов
    try {
        const products = await Product.getAllProducts(); // Вызываем статический метод getAllProducts класса Product для получения всех продуктов
        res.status(200).json(products); // Отправляем ответ с статусом 200 и списком продуктов в JSON-формате
    } catch (error) {
        res.status(500).json({ message: error.message }); // Если произошла ошибка, отправляем ответ с статусом 500 и сообщением об ошибке
    }
};

exports.getProductById = async (req, res) => { // Определяем экспортируемую функцию getProductById для получения продукта по его ID
    try {
        const product = await Product.getProductById(req.params.id); // Вызываем статический метод getProductById класса Product для получения продукта по его ID
        res.status(200).json(product); // Отправляем ответ с статусом 200 и продуктом в JSON-формате
    } catch (error) {
        res.status(500).json({ message: error.message }); // Если произошла ошибка, отправляем ответ с статусом 500 и сообщением об ошибке
    }
};

exports.createProduct = async (req, res) => { // Определяем экспортируемую функцию createProduct для создания нового продукта
    try {
        const product = await Product.createProduct(req.body); // Вызываем статический метод createProduct класса Product для создания нового продукта
        res.status(201).json(product); // Отправляем ответ с статусом 201 и новым продуктом в JSON-формате
    } catch (error) {
        res.status(500).json({ message: error.message }); // Если произошла ошибка, отправляем ответ с статусом 500 и сообщением об ошибке
    }
};

exports.updateProduct = async (req, res) => { // Определяем экспортируемую функцию updateProduct для обновления продукта
    try {
        const product = await Product.updateProduct(req.params.id, req.body); // Вызываем статический метод updateProduct класса Product для обновления продукта
        res.status(200).json({ message: "Продукт обновлен успешно" }); // Отправляем ответ с статусом 200 и сообщением об успешном обновлении продукта
    } catch (error) {
        res.status(500).json({ message: error.message }); // Если произошла ошибка, отправляем ответ с статусом 500 и сообщением об ошибке
    }
};

exports.deleteProduct = async (req, res) => { // Определяем экспортируемую функцию deleteProduct для удаления продукта
    try {
        const product = await Product.deleteProduct(req.params.id); // Вызываем статический метод deleteProduct класса Product для удаления продукта
        res.status(200).json({ message: "ПРодукт удален успешно" }); // Отправляем ответ 
    } catch (error) {
        res.status(500).json({ message: error.message }); // Если произошла ошибка, отправляем ответ с статусом 500 и сообщением об ошибке
    }
};