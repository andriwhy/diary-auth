const userService = require('../services/userService');
const bcrypt = require('bcryptjs');
const jwt = require('@hapi/jwt'); // Digunakan untuk verifikasi token JWT

// Handler untuk registrasi user
exports.registerUser = async (request, h) => {
    const { name, email, password } = request.payload;

    try {
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            return h.response({ error: 'Email already in use' }).code(400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await userService.createUser({
            name,
            email,
            password: hashedPassword,
        });

        return h.response({
            message: 'User registered successfully',
            userId,
        }).code(201);
    } catch (error) {
        console.error('Error in registerUser handler:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

// Handler untuk login user
exports.login = async (request, h) => {
    const { email, password } = request.payload;

    try {
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return h.response({ error: 'Invalid email or password' }).code(401);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return h.response({ error: 'Invalid email or password' }).code(401);
        }

        const token = jwt.token.generate(
            {
                userId: user.id,
                email: user.email,
                exp: Math.floor(Date.now() / 1000) + 3600, // Token exp 1 jam
            },
            {
                key: process.env.JWT_SECRET,
                algorithm: 'HS256',
            }
        );

        return h.response({
            message: 'Login successful',
            token,
        }).code(200);
    } catch (error) {
        console.error('Error in login handler:', error);
        return h.response({ error: 'Failed to login' }).code(500);
    }
};

// Handler untuk mendapatkan user berdasarkan ID
exports.getUser = async (request, h) => {
    const userId = request.params.userId;
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
        return h.response({ error: 'Authentication token is required' }).code(401);
    }

    try {
        const decoded = jwt.token.decode(token); // Decode token untuk memeriksa userId
        if (decoded.userId !== userId) {
            return h.response({ error: 'Unauthorized access' }).code(403);
        }

        const user = await userService.getUserById(userId);
        if (!user) {
            return h.response({ error: 'User not found' }).code(404);
        }

        return h.response({ user }).code(200);
    } catch (error) {
        console.error('Error in getUser handler:', error);
        return h.response({ error: 'Failed to retrieve user' }).code(500);
    }
};

// Handler untuk update user
exports.updateUser = async (request, h) => {
    const userId = request.params.userId;
    const token = request.headers.authorization?.split(' ')[1];
    const { name, email, password } = request.payload;

    if (!token) {
        return h.response({ error: 'Authentication token is required' }).code(401);
    }

    try {
        const decoded = jwt.token.decode(token); // Decode token untuk memeriksa userId
        if (decoded.userId !== userId) {
            return h.response({ error: 'Unauthorized access' }).code(403);
        }

        const updatedData = { name, email };
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        const updatedUser = await userService.updateUser(userId, updatedData);
        if (!updatedUser) {
            return h.response({ error: 'User not found' }).code(404);
        }

        return h.response({ message: 'User updated successfully' }).code(200);
    } catch (error) {
        console.error('Error in updateUser handler:', error);
        return h.response({ error: 'Failed to update user' }).code(500);
    }
};

// Handler untuk delete user
exports.deleteUser = async (request, h) => {
    const userId = request.params.userId;
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
        return h.response({ error: 'Authentication token is required' }).code(401);
    }

    try {
        const decoded = jwt.token.decode(token); // Decode token untuk memeriksa userId
        if (decoded.userId !== userId) {
            return h.response({ error: 'Unauthorized access' }).code(403);
        }

        const deletedUser = await userService.deleteUser(userId);
        if (!deletedUser) {
            return h.response({ error: 'User not found' }).code(404);
        }

        return h.response({ message: 'User deleted successfully' }).code(200);
    } catch (error) {
        console.error('Error in deleteUser handler:', error);
        return h.response({ error: 'Failed to delete user' }).code(500);
    }
};
