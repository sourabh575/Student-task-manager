const jwt = require('jsonwebtoken');

// --------- Auth Middleware ----------
// This middleware:
// 1. Extracts JWT token from Authorization header
// 2. Verifies the token
// 3. Extracts user info from token
// 4. Attaches user info to req.user
// 5. Allows the request to proceed or blocks it

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    // Expected format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ 
        message: 'No authorization token provided' 
      });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({ 
        message: 'Invalid authorization header format' 
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token has expired. Please login again.' 
        });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Invalid token' 
        });
      }
      throw err;
    }

    // Attach user info to request object
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };

    // Allow request to proceed
    next();

  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ 
      message: 'Authentication failed', 
      error: err.message 
    });
  }
};

module.exports = authMiddleware;
