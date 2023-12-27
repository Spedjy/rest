const sqlite3 = require('sqlite3').verbose(); // Импортируем библиотеку sqlite3 для работы с базой данных SQLite
const db = new sqlite3.Database('products.db'); // Создаем объект базы данных, используя файл 'products.db'

db.serialize(() => { // Запускаем блок кода с использованием сериализации транзакций
    db.run(`CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, price REAL)`); // Создаем таблицу products с автоинкрементирующимся ID, полями name и price
});

class Product { // Создаем класс Product для работы с продуктами
    constructor(id, name, price) { // Конструктор класса Product
        this.id = id;
        this.name = name;
        this.price = price;
    }

    static async getAll() { // Статический метод getAll для получения всех продуктов из базы данных
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM products', (err, rows) => { // Выполняем запрос к базе данных для получения всех продуктов
                if (err) return reject(err); // Если произошла ошибка, возвращаем ее
                resolve(rows.map(row => new Product(row.id, row.name, row.price))); // Преобразуем результаты запроса в массив объектов Product и возвращаем их
            });
        });
    }

    static async getById(id) { // Статический метод getById для получения продукта по его ID
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => { // Выполняем запрос к базе данных для получения продукта по его ID
                if (err) return reject(err); // Если произошла ошибка, возвращаем ее
                resolve(row ? new Product(row.id, row.name, row.price) : null); // Если продукт найден, создаем объект Product и возвращаем его, иначе возвращаем null
            });
        });
    }

    static async add(name, price) { // Статический метод add для добавления нового продукта в базу данных
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO products (name, price) VALUES (?, ?)', [name, price], function(err) { // Выполняем запрос к базе данных для добавления нового продукта
                if (err) return reject(err); // Если произошла ошибка, возвращаем ее
                resolve(this.lastID); // Если добавление прошло успешно, возвращаем ID добавленного продукта
            });
        });
    }

    static async update(id, name, price) { // Статический метод update для обновления информации о продукте в базе данных
        return new Promise((resolve, reject) => {
            db.run('UPDATE products SET name = ?, price = ? WHERE id = ?', [name, price, id], function(err) { // Выполняем запрос к базе данных для обновления информации о продукте
                if (err) return reject(err); // Если произошла ошибка, возвращаем ее
                resolve(this.changes); // Если обновление прошло успешно, возвращаем количество измененных записей
            });
        });
    }

    static async delete(id) { // Статический метод delete для удаления продукта из базы данных
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM products WHERE id = ?', [id], function(err) { // Выполняем запрос к базе данных для удаления продукта по его ID
                if (err) return reject(err); // Если произошла ошибка, возвращаем ее
                resolve(this.changes); // Если удаление прошло успешно, возвращаем количество удаленных записей
            });
        });
    }
}

module.exports = Product; // Экспортируем класс Product для использования в других файлах