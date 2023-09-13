const jwt = require('jsonwebtoken');

const verifyAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token)
    return res.status(401).json({ message: 'Authentication required' });
  jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decodedToken;
    next();
  });
};

module.exports = verifyAuth;
