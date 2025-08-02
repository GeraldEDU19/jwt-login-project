const bcrypt = require('bcrypt');
const crypto = require('crypto');

class PasswordService {
    constructor() {
        this.saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    }

    // Hash password
    async hashPassword(password) {
        try {
            this.validatePassword(password);
            const salt = await bcrypt.genSalt(this.saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);
            return hashedPassword;
        } catch (error) {
            throw new Error('Error hashing password: ' + error.message);
        }
    }
TE
    async verifyPassword(password, hashedPassword) {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            throw new Error('Error verifying password: ' + error.message);
        }
    }

    // Validate password strength
    validatePassword(password) {
        if (!password || password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        if (!/[A-Z]/.test(password)) {
            throw new Error('Password must contain at least one uppercase letter');
        }

        if (!/[a-z]/.test(password)) {
            throw new Error('Password must contain at least one lowercase letter');
        }

        if (!/(?=.*\d)/.test(password)) {
            throw new Error('Password must contain at least one digit');
        }

        if (!/(?=.*[@$!%*?&])/.test(password)) {
            throw new Error('Password must contain at least one special character: @$!%*?&');
        }

        return true;
    }

    // Generate secure temporary password
    generateTempPassword(length = 12) {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const specialChars = '@$!%*?&';

        const allChars = uppercase + lowercase + numbers + specialChars;
        let password = '';

        // Ensure at least one character from each type
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += specialChars[Math.floor(Math.random() * specialChars.length)];

        // Fill the rest of the length
        for (let i = 4; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        // Shuffle the password
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    // Check if password is already hashed
    isHashed(password) {
        return password && password.startsWith('$2b$');
    }

    // Generate custom salt for special cases
    generateCustomSalt() {
        return crypto.randomBytes(32).toString('hex');
    }
}

module.exports = new PasswordService();