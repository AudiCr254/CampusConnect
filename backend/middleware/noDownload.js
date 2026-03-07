/**
 * Middleware to prevent file downloads
 * Sets headers to display content inline instead of downloading
 */
module.exports = (req, res, next) => {
  // Set content to display inline (not as attachment)
  res.setHeader('Content-Disposition', 'inline');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Add security headers to prevent caching and copying
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Prevent framing (clickjacking protection)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  next();
};
