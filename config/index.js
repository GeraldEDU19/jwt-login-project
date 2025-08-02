const { refreshSecretKey, refreshTokenExpiry } = require('../services/jwtService');

require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    jwt: {
        secret: process.env.JWT_SECRET || 'default_secret',
        refreshSecretKey: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
        accessTokenExpiry: process.env.JWT_EXPIRY || '15m',
        refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    },

    password: {
        saltRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
    },

    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true
    }

}

module.exports = config;