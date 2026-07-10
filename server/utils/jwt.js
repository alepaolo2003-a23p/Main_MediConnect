const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../constants");

function createAccessToken(user) {
    const expToken = new Date();

    expToken.setHours(expToken.getHours() + 3);

    const payload = {
        token_type: "access",
        user_id: user._id,
        iat: Date.now(),
        exp: expToken.getTime(),
    };
    return jwt.sign(payload, JWT_SECRET_KEY);
}

function createRefreshToken(user){
    const expToken = new Date();
    expToken.setMonth(expToken.getMonth() + 1);
    const payload = {
        token_type: "refresh",
        user_id: user._id,
        iat: Date.now(),
        exp: expToken.getTime(),
    };
    return jwt.sign(payload, JWT_SECRET_KEY);
}

function verifyToken(token){
    return jwt.verify(token, JWT_SECRET_KEY);
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    verifyToken
};