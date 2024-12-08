const userHandler = require('../handlers/userHandlers');

module.exports = [
    {
        method: 'POST',
        path: '/register',
        handler: userHandler.registerUser,
        options: {
            auth: false, // Tidak memerlukan otentikasi untuk registrasi
        },
    },
    {
        method: 'POST',
        path: '/login',
        handler: userHandler.login,
        options: {
            auth: false, // Tidak memerlukan otentikasi untuk login
        },
    },
    // Endpoint untuk mendapatkan user berdasarkan ID
    {
        method: 'GET',
        path: '/user/{userId}',
        handler: userHandler.getUser,
        options: {
            auth: 'jwt',  // Memerlukan otentikasi JWT untuk akses
        },
    },
    // Endpoint untuk update user
    {
        method: 'PUT',
        path: '/user/{userId}',
        handler: userHandler.updateUser,
        options: {
            auth: 'jwt',  // Memerlukan otentikasi JWT untuk akses
        },
    },
    // Endpoint untuk delete user
    {
        method: 'DELETE',
        path: '/user/{userId}',
        handler: userHandler.deleteUser,
        options: {
            auth: 'jwt',  // Memerlukan otentikasi JWT untuk akses
        },
    },
];
