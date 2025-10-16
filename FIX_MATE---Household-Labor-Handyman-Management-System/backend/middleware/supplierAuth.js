import jwt from "jsonwebtoken";

const supplierAuth = async (req, res, next) => {
    console.log('supplierAuth middleware called');
    const { supplier_token } = req.cookies;
        if (!supplier_token) {
            console.error('No supplier_token cookie found');
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again (no cookie)' });
    }
    try {
        const tokenDecode = jwt.verify(supplier_token, process.env.JWT_SECRET);
            console.log('Decoded JWT:', tokenDecode);

            if (tokenDecode.id) {
                req.user = { id: tokenDecode.id };
            } else {
                console.error('Token decode failed: no id');
                return res.status(401).json({ success: false, message: 'Not Authorized. Login Again (no id in token)' });
        }
        next();
    } catch (error) {
            console.error('JWT verification error:', error);
            return res.status(401).json({ success: false, message: error.message });
    }
};

export default supplierAuth;
