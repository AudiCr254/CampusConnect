/**
 * Middleware to verify admin key for protected routes
 * Admin key should be sent in the 'x-admin-key' header
 */
module.exports = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  
  if (!adminKey) {
    return res.status(401).json({ 
      success: false,
      message: 'Admin key is required. Please provide x-admin-key header.' 
    });
  }
  
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ 
      success: false,
      message: 'Invalid admin key. Access denied.' 
    });
  }
  
  next();
};
