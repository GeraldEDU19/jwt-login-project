const path = require('path');
const fs = require('fs');
const userService = require('../services/userService');

const getLoginPage = (req, res) => {
    try {
        const loginPath = path.join(__dirname, '../HTML/login.html');
        
        fs.readFile(loginPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading the file:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            res.send(data);
        });
    } catch (error) {
        console.error('Error in getLoginPage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const postLogin = async (req, res) => {
    try {
        const { username, password, remember } = req.body;

        const authResult = await userService.authenticateUser(username, password, remember);

        res.json({
            message: 'Login successful',
            user: authResult.user,
            accessToken: authResult.accessToken,
            refreshToken: authResult.refreshToken
        });

    } catch (error) {
        console.error('Error in postLogin:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
}

const postRegister = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        const newUser = await userService.registerUser({
            username,
            email,
            password,
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser
        });

    } catch (error) {
        console.error('Error in postRegister:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
}

const logout = async (req, res) => {
    try {
        const token = req.token;

        if (token) { 
            await userService.logout(token);
        }

    } catch (error) {
        console.error('Log out error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getUsers = (req, res) => {
    try {
        const users = userService.getAllUsers();

        res.json({
            success: true,
            users: users
        });

    } catch (error) {
        console.error('Error in getUsers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getLoginPage,
    postLogin,
    postRegister,
    logout,
    getUsers
};