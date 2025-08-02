const fs = require('fs');
const path = require('path');
const passwordService = require('../services/passwordService');

class UserRepository {
    constructor() {
        this.usersFilePath = path.join(__dirname, '../data/users.json');
        this.users = [];
        this.nextId = 1;
        this.loadUsers();
    }

    async loadUsers() {
        try {
            console.log('Loading users from JSON...');

            if(!fs.existsSync(this.usersFilePath)) {
                console.log('Users file does not exist, initializing with empty array');
                this.users = [];
                return;
            }

            const fileContent = fs.readFileSync(this.usersFilePath, 'utf8');
            const usersFromFile = JSON.parse(fileContent);

            for (const user of usersFromFile) {
                if(!user.password.startsWith('$2b$')) {
                    console.log(`🔐 Hashing password for user: ${user.username}`);
                    user.password = await passwordService.hashPassword(user.password);
                }
                if (!user.id) {
                    user.id = this.nextId++;
                } else {
                    this.nextId = Math.max(this.nextId, user.id + 1);
                }
            }

            this.users = usersFromFile; // ¡ESTA LÍNEA FALTABA!
            console.log(`✅ ${this.users.length} users loaded successfully`);

        } catch (error) {
            console.error('❌ Error loading users:', error.message);
            this.users = [];
        }
    }

    findByUsername(username) {
        return this.users.find(user => user.username === username);
    }

    findByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    findById(id) {
        return this.users.find(user => user.id === parseInt(id));
    }

    async createUser(userData) {
        try {
            if(this.findByUsername(userData.username)) {
                throw new Error('Username already exists');
            }
            if(this.findByEmail(userData.email)) {
                throw new Error('Email already exists');
            }

            const hashedPassword = await passwordService.hashPassword(userData.password);

            const newUser = {
                id: this.nextId++,
                username: userData.username,
                email: userData.email,
                password: hashedPassword
            };

            this.users.push(newUser);
            console.log(`✅ User created: ${newUser.username} (ID: ${newUser.id})`);

            const { password, ...userWithoutPassword } = newUser;
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    }

    async verifyPassword(username, password) {
        try {
            const user = this.findByUsername(username);

            if(!user) {
                return false;
            }

            const isValid = await passwordService.verifyPassword(password, user.password);
            return isValid ? user : false;

        } catch (error) {
            console.error('❌ Error verifying password:', error.message);
            throw error;
        }
    }

    getAllUsers() {
        return this.users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }
    
}

module.exports = new UserRepository();