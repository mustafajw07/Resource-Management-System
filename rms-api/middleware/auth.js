import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const roleMiddleware = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({ message: "Authorization header missing!" });
            }

            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Token missing!" });
            }

            const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded.user;
            
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: "Forbidden: You don't have the required role!" });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal jwt server error!" });
        }
    };

}

export default roleMiddleware;