import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in cookies or Authorization header
        if (req.cookies?.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // retain claims for downstream checks
    req.authClaims = decoded;

        // If this is an admin token (from admin login), don't require DB lookup
        if (decoded && decoded.admin === true) {
            req.user = {
                // use placeholder ObjectId string to avoid cast errors where ObjectId is expected
                id: decoded.id || '000000000000000000000000',
                email: decoded.email || process.env.ADMIN_EMAIL || 'Admin@fixmate',
                role: 'admin'
            };
            return next();
        }

        // Otherwise, get user from DB using "id" in token payload
        if (!decoded?.id) {
            return res.status(401).json({ message: 'Invalid token payload' });
        }

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Admin middleware
export const admin = (req, res, next) => {
    const isRoleAdmin = !!(req.user && req.user.role === 'admin');
    const isAdminClaim = !!(req.authClaims && req.authClaims.admin === true);
    const isAdminEmail = !!(req.user && (req.user.email === (process.env.ADMIN_USERNAME || 'Admin@fixmate')));

    if (isRoleAdmin || isAdminClaim || isAdminEmail) {
        return next();
    }
    return res.status(403).json({ message: 'Not authorized as admin' });
};