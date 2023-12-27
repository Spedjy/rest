const sqlite3 = require('sqlite3').verbose(); // Импортируем библиотеку sqlite3 для работы с базой данных SQLite
const db = new sqlite3.Database('users.db'); // Создаем объект базы данных, используя файл 'users.db'
const jwt = require('jsonwebtoken'); // Импортируем библиотеку jsonwebtoken для работы с JWT токенами
const bcrypt = require('bcrypt'); // Импортируем библиотеку bcrypt для хэширования паролей

db.serialize(() => { // Запускаем блок кода с использованием сериализации транзакций
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, // Создаем таблицу users с автоинкрементирующимся ID
        name TEXT, // Поле для имени
        email TEXT UNIQUE, // Поле для электронной почты с уникальностью
        password TEXT, // Поле для пароля
        role TEXT // Поле для роли пользователя
        )`); // Конец создания таблицы
});

class User { // Создаем класс User для работы с пользователями
    constructor(id, name, email, password, role) { // Конструктор класса User
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    static async register(userData) { // Статический метод register для регистрации нового пользователя
        const hashedPassword = await bcrypt.hash(userData.password, 10); // Хэшируем пароль перед сохранением
        const newUser = { // Создаем объект с данными нового пользователя
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role
        };

        const result = await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [newUser.name, newUser.email, newUser.password, newUser.role]); // Вставляем данные нового пользователя в таблицу users

        const userId = result.lastID; // Получаем ID вставленного пользователя
        return newUser; // Возвращаем объект нового пользователя
    }

    static async login(userData) { // Статический метод login для аутентификации пользователя
        const user = await db.get('SELECT * FROM users WHERE email = ?', [userData.email]); // Получаем пользователя по его электронной почте

        if (!user) return null; // Если пользователь не найден, возвращаем null

        const isValidPassword = await bcrypt.compare(userData.password, user.password); // Проверяем, является ли введенный пароль верным

        if (!isValidPassword) return null; // Если пароль неверный, возвращаем null

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' }); // Генерируем JWT токен для аутентификации

        return { token }; // Возвращаем объект с токеном
    }
}

module.exports = User; // Экспортируем класс User для использования в других файлах