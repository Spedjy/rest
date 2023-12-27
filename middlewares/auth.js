const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send('Access denied');

    try {
        const secretKey = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
        } catch (err) {
        res.status(403).send('Forbidden');
    }
};

module.exports = auth;