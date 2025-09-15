const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  // Debug header to confirm middleware runs
  res.setHeader('X-Auth-Middleware', token ? 'token-present' : 'no-token');

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.clearCookie('token');
    return res.redirect('/login');
  }
};

module.exports = { authenticateToken };
