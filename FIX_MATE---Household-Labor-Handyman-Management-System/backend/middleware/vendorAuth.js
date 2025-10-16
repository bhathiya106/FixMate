import jwt from "jsonwebtoken";

const vendorAuth = async (req, res, next) => {
	const { vendor_token } = req.cookies;

	if (!vendor_token) {
		return res.json({ success: false, message: 'Not Authorized. Login Again' });
	}

	try {
		const tokenDecode = jwt.verify(vendor_token, process.env.JWT_SECRET);

		if (tokenDecode.id) {
			req.user = { id: tokenDecode.id };
		} else {
			return res.json({ success: false, message: 'Not Authorized. Login Again' });
		}
		next();
	} catch (error) {
		return res.json({ success: false, message: error.message });
	}
};

export default vendorAuth;
