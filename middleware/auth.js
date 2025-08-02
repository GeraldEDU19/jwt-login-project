const jwtService = require('../services/jwtService');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token is missing' });
    }

    try {
        
        const decoded = jwtService.verifyAccessToken(token);
        req.user = decoded;
        req.token = token;
        next();

    } catch (error) {
        return res.status(403).json({
            error: error.message || 'Invalid token'
        })
    }
}

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token) {
        try {

            const decoded = jwtService.verifyAccessToken(token);
            req.user = decoded;
            req.token = token;

        } catch (error) {

        }
    }

    next();
}

module.exports = {
    authenticateToken,
    optionalAuth
}