const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('products.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, price REAL)`);
});

class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
}

    static async getAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM products', (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(row => new Product(row.id, row.name, row.price)));
            });
        });
    }

    static async getById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
                if (err) return reject(err);
                resolve(row ? new Product(row.id, row.name, row.price) : null);
            });
        });
    }

    static async add(name, price) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO products (name, price) VALUES (?, ?)', [name, price], function(err) {
                if (err) return reject(err);
                resolve(this.lastID);
            });
        });
    }

    static async update(id, name, price) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE products SET name = ?, price = ? WHERE id = ?', [name, price, id], function(err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    }
}

module.exports = Product;