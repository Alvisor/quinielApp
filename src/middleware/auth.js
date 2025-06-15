const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido' });
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, payload) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.userId = payload.userId;
    next();
  });
}

module.exports = authenticateToken;
