const firestore = require('../config/firestore');

const DIARIES_COLLECTION = 'diaries';

exports.createDiary = async ({ date, content }) => {
    const diaryRef = firestore.collection(DIARIES_COLLECTION).doc();
    const diaryData = {
        date,
        content,
        createdAt: new Date(),
    };
    await diaryRef.set(diaryData);
    return diaryRef.id;
};

exports.getDiaryById = async (id) => {
    const diaryDoc = await firestore.collection(DIARIES_COLLECTION).doc(id).get();
    return diaryDoc.exists ? diaryDoc.data() : null;
};

exports.updateDiary = async (id, updatedData) => {
    const diaryRef = firestore.collection(DIARIES_COLLECTION).doc(id);
    const diaryDoc = await diaryRef.get();
    if (!diaryDoc.exists) {
        return false;
    }
    await diaryRef.update(updatedData);
    return true;
};

exports.deleteDiary = async (id) => {
    const diaryRef = firestore.collection(DIARIES_COLLECTION).doc(id);
    const diaryDoc = await diaryRef.get();
    if (!diaryDoc.exists) {
        return false;
    }
    await diaryRef.delete();
    return true;
};
