const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore({
    projectId: 'capstone-project-441823',
    keyFilename: 'credentials.json', 
});

module.exports = firestore;
