const app = require('../app');

// Export a handler function compatible with @vercel/node
module.exports = (req, res) => app(req, res);


