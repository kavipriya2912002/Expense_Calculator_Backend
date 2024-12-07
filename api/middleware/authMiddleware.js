// authMiddleware.js
export const authenticate = async (req, res, next) => {
    try {
      // Assuming you are using JWT for authentication
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      // Verify token (Assuming you have a method to verify JWT tokens)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
  
      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
  