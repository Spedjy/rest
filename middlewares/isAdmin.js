const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Доступ запрещен');
    }
    next();
};

module.exports = isAdmin;