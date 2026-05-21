const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userAuth = async (req, res, next) => {
    try {
        // Try getting token from Cookies
        let token = req.cookies.token;

        //  If no cookie, try getting from Header
        if (!token && req.headers.authorization) {
            // Header format: "Bearer <token>"
            const parts = req.headers.authorization.split(" ");
            if (parts.length === 2) {
                token = parts[1];
            }
        }

        // Validation
        if (!token || token === "null" || token === "undefined") {
            return res.status(401).json({ success: false, message: "Please Login! (Token missing)" });
        }

        // Verify Token
        const decodeObj = await jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodeObj;

        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({ success: false, message: "User does not exist" });
        }

        req.user = user;
        next(); // if all good, move next

    } catch (err) {
        res.status(401).json({ success: false, message: "Authentication failed: " + err.message });
    }
};

module.exports = { userAuth };