const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_KEY,
        { expiresIn: "7d" } // optional, you can customize token expiry
    );
};

module.exports.generateToken = generateToken;
