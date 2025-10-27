const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

function sellerOnly(req, res, next) {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
}

module.exports = { authMiddleware, sellerOnly };
