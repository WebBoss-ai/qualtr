import jwt from "jsonwebtoken";

const isAuthenticated2 = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(token);

        // If no token, allow the request to proceed as a non-authenticated user
        if (!token) {
            req.id = null; // No user ID for unauthenticated users
            return next(); // Proceed to the next middleware or controller
        }

        // If token exists, verify it and extract user info
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        req.id = decode.userId; // Attach user ID for authenticated users
        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
        });
    }
};

export default isAuthenticated2;
