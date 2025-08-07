const userRepository = require('../repositories/userRepository');
const jwtService = require('./jwtService');
const passwordService = require('./passwordService');
const { jwt, password } = require('../config');

class UserService {

    async authenticateUser(username, password) {

        try {

            if (!username || !password) {
                throw new Error('Username and password are required');
            }

            const user = await userRepository.verifyPassword(username, password);

            if (!user) {
                throw new Error('Invalid username or password');
            }

            const tokenPair = jwtService.generateTokenPair({
                userId: user.id,
                username: user.username,
                email: user.email
            });

            const { password: _, ...userWithoutPassword } = user;
            return {
                user: userWithoutPassword,
                ...tokenPair
            }

        } catch (error) {
            throw error;
        }
    }

    async registerUser(userData) {
        try {

            if (!userData.username || !userData.email || !userData.password) {
                throw new Error('Username, email, and password are required');
            }

            passwordService.validatePassword(userData.password);

            const newUser = await userRepository.createUser(userData);

            return newUser;

        } catch (error) {
            throw error
        }
    }

    async logoutUser(token) {
        try {
            console.log(`Revoking token: ${token.substring(0, 10)}...`);
            jwtService.revokeToken(token);
            console.log(`Token revoked successfully.`);
            return { success: true, message: 'Logged out successfully' };
        } catch (error) {
            throw error
        }
    }

    async getAllUsers() {
        try {
            return await userRepository.getAllUsers();
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new UserService();