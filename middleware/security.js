const helmet = require('helmet');
const xss = require('xss');
const validator = require('validator');

//Helmet configuration for general security
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'", "https://cdn.jsdelivr.net"]
        }
    },
    crossOriginEmbedderPolicy: false,
});

// Middleware to sanitize HTML/CSS
const sanitizeInput = (req, res, next) => {
    const sanitizeValue = (value) => {
        if (typeof value === 'string') {
            return xss(value, {
                whiteList: {}, // No tags allowed
                stripIgnoreTag: true, // Strip all tags
                stripIgnoreTagBody: ['script', 'style'] // Strip script and style tags
            });
        }
        return value;
    };

    const sanitizeObject = (obj) => {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitizeObject(obj[key]); // Recursively sanitize objects
                } else {
                    obj[key] = sanitizeValue(obj[key]); // Sanitize strings
                }
            }
        }
    };

    // Sanitize body, query and params
    if (req.body) sanitizeObject(req.body);
    if (req.query) sanitizeObject(req.query);
    if (req.params) sanitizeObject(req.params);

    next();
}

// Middleware to validate basic inputs
const validateInput = (req, res, next) => {
    //Validate for dangerous patterns
    const dangerousPatterns = [
        /<script[^>]*>.*?<\/script>/gi,    // Scripts
        /javascript:/gi,                   // JavaScript protocol
        /on\w+\s*=/gi,                    // Event handlers (onclick, onload)
        /eval\s*\(/gi,                    // eval function
        /expression\s*\(/gi               // CSS expressions (IE)
    ];

    const checkForDangerousPatterns = (value) => {
        if (typeof value === 'string') {
            return dangerousPatterns.some(pattern => pattern.test(value));
        }
        return false;
    };

    const checkObject = (obj) => {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    if (checkObject(obj[key])) return true; // Recursively check objects
                } else if (checkForDangerousPatterns(obj[key])) {
                    return true; // Check strings
                }
            }
        }
        return false;
    };

    if(req.body && checkObject(req.body)) {
        return res.status(400).json({ error: 'Invalid input detected' });
    }
    if(req.query && checkObject(req.query)) {
        return res.status(400).json({ error: 'Invalid input detected' });
    }

    next();

};

module.exports = {
    helmetConfig,
    sanitizeInput,
    validateInput
}