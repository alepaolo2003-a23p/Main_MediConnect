const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;

const API_VERSION = process.env.API_VERSION || "v1";
const IP_SERVER = process.env.IP_SERVER || "localhost";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    API_VERSION,
    IP_SERVER,
    JWT_SECRET_KEY,
};
