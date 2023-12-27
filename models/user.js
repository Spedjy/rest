const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
        )`);
});

class User {
    constructor(id, name, email, password, role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
}

    static async register(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role
};

        const result = await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [newUser.name, newUser.email, newUser.password, newUser.role]);

        const userId = result.lastID;
        return newUser;
}

    static async login(userData) {
        const user = await db.get('SELECT * FROM users WHERE email = ?', [userData.email]);

        if (!user) return null;

        const isValidPassword = await bcrypt.compare(userData.password, user.password);

        if (!isValidPassword) return null;

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });

        return { token };
    }
}

module.exports = User;