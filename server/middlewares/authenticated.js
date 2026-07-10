const jwt = require("../utils/jwt");

function ensureAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).send({ msg: "La petición no tiene la cabecera de autenticación" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const { user_id } = jwt.verifyToken(token);
        req.user_id = user_id;
        next();
    } catch (error) {
        return res.status(401).send({ msg: "Token inválido o expirado" });
    }
}

module.exports = ensureAuth;