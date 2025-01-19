import jwt from "jsonwebtoken";

const isAuthenticated2 = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            req.id = null; // No user ID for unauthenticated users
            return next();
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.id = decode.userId; // Attach user ID for authenticated users
        next();
    } catch (error) {
        console.error('Error in authentication:', error.message);
        req.id = null; // Fallback for invalid token
        next(); // Allow access but mark as unauthenticated
    }
};

export default isAuthenticated2;
