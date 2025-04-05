
import jwt from 'jsonwebtoken';


const JWT_SECRET = 'your_jwt_secret';
const authMiddleware = (req, res, next) => {
console.log("req:",req);


    const authHeader = req.header('Authorization');
  
    // 🔐 Handle missing token
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    // 🪪 Extract token safely
    const token = authHeader.replace('Bearer ', '');
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Attach decoded payload (user ID, role, etc.)
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
  
  export default authMiddleware;