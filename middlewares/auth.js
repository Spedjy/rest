const jwt = require('jsonwebtoken'); // Импортируем библиотеку jsonwebtoken для работы с JWT токенами

const auth = (req, res, next) => { // Создаём middleware под названием auth
    const authHeader = req.headers['authorization']; // Извлекаем заголовок authorization из запроса
    const token = authHeader && authHeader.split(' ')[1]; // Извлекаем токен из заголовка authorization

    if (!token) return res.status(401).send('Access denied'); // Если токен отсутствует, отправляем статус 401 и сообщение "Access denied"

    try {
        const secretKey = process.env.SECRET_KEY; // Получаем секретный ключ из переменной окружения SECRET_KEY
        const decoded = jwt.verify(token, secretKey); // Проверяем подлинность токена с помощью секретного ключа
        req.user = decoded; // Сохраняем информацию о пользователе в объекте запроса
        next(); // Вызываем следующий middleware или маршрут в цепочке
    } catch (err) {
        res.status(403).send('Forbidden'); // Если произошла ошибка при проверке токена, отправляем статус 403 и сообщение "Forbidden"
    }
};

module.exports = auth; // Экспортируем middleware auth для использования в других файлах