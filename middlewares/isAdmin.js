const isAdmin = (req, res, next) => { // Создаём middleware под названием isAdmin
    if (req.user.role !== 'admin') { // Проверяем, является ли текущий пользователь администратором
        return res.status(403).send('Доступ запрещен'); // Если нет, отправляем статус 403 и сообщение "Доступ запрещен"
    }
    next(); // Если да, переходим к следующему middleware или маршруту в цепочке
};

module.exports = isAdmin; // Экспортируем middleware isAdmin для использования в других файлах