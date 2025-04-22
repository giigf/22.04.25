const jwt = require('jsonwebtoken');
const SECRET_KEY = 'bratya_secret';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'Нет токена' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // кладём в запрос
    next();
  } catch (e) {
    return res.status(403).json({ error: 'Неверный токен' });
  }
}

module.exports = authMiddleware;
