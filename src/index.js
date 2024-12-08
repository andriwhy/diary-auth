const Hapi = require('@hapi/hapi');
const hapiJwt = require('@hapi/jwt');
const userRoutes = require('./routes/userRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 4000,
        host: process.env.HOST || 'localhost',
    });

    await server.register(hapiJwt);

    server.auth.strategy('jwt', 'jwt', {
        keys: JWT_SECRET,
        verify: { aud: false, iss: false, sub: false },
        validate: (artifacts, request, h) => {
            const currentTime = Math.floor(Date.now() / 1000); 
            const expirationTime = artifacts.decoded.payload.exp; 
            console.log('Current Time:', currentTime);
            console.log('Token Expiry Time:', expirationTime);

            if (currentTime > expirationTime) {
                return { isValid: false }; 
            }

            return { isValid: true, credentials: { user: artifacts.decoded.payload } };
        },
    });

    server.auth.default('jwt');

    server.ext('onRequest', (request, h) => {
        console.log(`Incoming Request: ${request.method.toUpperCase()} ${request.path}`);
        return h.continue;
    });

    server.route([...userRoutes, ...diaryRoutes]);

    try {
        await server.start();
        console.log('Server started successfully!');
        console.log(`Server running on ${server.info.uri}`);
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

init();
