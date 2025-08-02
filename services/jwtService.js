const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { type } = require('os');

//Blacklist for invalid tokens
const tokenBlacklist = new Set();

class JWTService {
    constructor() {
        this.secretKey = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
        this.refreshSecretKey = process.env.JWT_REFRESH_SECRET || crypto.randomBytes(64).toString('hex');
        this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
        this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
    }

    generateAccessToken(payload) {
        return jwt.sign(
            {
                ...payload,
                type:"access",
                jti: crypto.randomUUID(),
            },
            this.secretKey,
            {
                expiresIn: this.accessTokenExpiry,
                issuer: "jwt-login-project",
                audience: "jwt-login-project-users",
            }
        )
    }

    generateRefreshToken(payload) {
        return jwt.sign (
            {
                ...payload,
                type: "refresh",
                jti: crypto.randomUUID(),
            },
            this.secretKey,
            {
                expiresIn: this.refreshTokenExpiry,
                issuer: "jwt-login-project",
                audience: "jwt-login-project-users",
            }
            
        )
    }

    verifyAccessToken(token) {
        try {

            if(tokenBlacklist.has(token)) {
                throw new Error("Token is blacklisted");
            }

            const decoded = jwt.verify(token, this.secretKey, {
                issuer: "jwt-login-project",
                audience: "jwt-login-project-users",
            })

            if(decoded.type !== "access") {
                throw new Error("Invalid token type");
            }

            return decoded

        } catch (error) {
            throw new Error("Invalid access token: " + error.message);
        }
    }

    verifyRefreshToken(token) {
        try {

            if(tokenBlacklist.has(token)) {
                throw new Error("Token is blacklisted");
            }

            const decoded = jwt.verify(token, this.refreshSecretKey, {
                issuer: "jwt-login-project",
                audience: "jwt-login-project-users",
            })

            if(decoded.type !== "refresh") {
                throw new Error("Invalid token type");
            }

            return decoded

        } catch (error) {
            throw new Error("Invalid refresh token: " + error.message);
        }
    }

    revokeToken(token) {
        tokenBlacklist.add(token);
        console.log(`Token revoked: ${token.substring(0, 10)}...`);
    }

    generateTokenPair(payload) {
        const userPayload = {
            userId: payload.userId,
            username: payload.username,
            email: payload.email,
        }

        return {
            accessToken: this.generateAccessToken(userPayload),
            refreshToken: this.generateRefreshToken(userPayload),
        };
    }

}

module.exports = new JWTService();