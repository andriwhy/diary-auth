const firestore = require('../config/firestore');

const USERS_COLLECTION = 'users';

// Fungsi untuk create user
exports.createUser = async ({ name, email, password }) => {
    const userRef = firestore.collection(USERS_COLLECTION).doc();
    const userData = {
        name,
        email,
        password,
        createdAt: new Date(),
    };
    await userRef.set(userData);
    return userRef.id;
};

// Fungsi untuk mendapatkan user berdasarkan ID
exports.getUserById = async (userId) => {
    const userRef = firestore.collection(USERS_COLLECTION).doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        return null;
    }

    return { id: userDoc.id, ...userDoc.data() };
};

// Fungsi untuk mendapatkan user berdasarkan email
exports.getUserByEmail = async (email) => {
    const userSnapshot = await firestore
        .collection(USERS_COLLECTION)
        .where('email', '==', email)
        .get();

    if (userSnapshot.empty) {
        return null;
    }

    const userDoc = userSnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
};

// Fungsi untuk update user
exports.updateUser = async (userId, updatedData) => {
    const userRef = firestore.collection(USERS_COLLECTION).doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        return null;
    }

    await userRef.update(updatedData);
    return { id: userId, ...updatedData };  // Return updated user data
};

// Fungsi untuk delete user
exports.deleteUser = async (userId) => {
    const userRef = firestore.collection(USERS_COLLECTION).doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        return null;
    }

    await userRef.delete();
    return { id: userId, message: 'User deleted' }; // Return deleted user data
};
