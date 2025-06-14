const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function (req, res, next) {
    // ✅ Correct cookie access
    const token = req.cookies.token;

    if (!token) {
        req.flash("error", "You need to login first");
        return res.redirect('/');
    }

    try {
        // ✅ Verify token
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // ✅ Fetch user without password
        const user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect('/');
        }

        // ✅ Attach user to request
        req.user = user;
        next();
    } catch (err) {
        console.error("JWT Error:", err.message);
        req.flash("error", "Something went wrong.");
        res.redirect('/');
    }
};
