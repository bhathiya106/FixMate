import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try {
        let token = req.cookies?.token;
        // Allow Authorization: Bearer <token> fallback
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Allow admin tokens to pass through without DB user
        if (decoded && decoded.admin === true) {
            req.user = {
                id: decoded.id || '000000000000000000000000',
                email: decoded.email || process.env.ADMIN_USERNAME || 'Admin@fixmate',
                role: 'admin',
            };
            req.authClaims = decoded;
            return next();
        }

        if (decoded?.id) {
            req.user = { id: decoded.id };
            return next();
        }

        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};

export default userAuth;