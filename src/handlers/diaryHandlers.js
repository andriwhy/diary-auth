const diaryService = require('../services/diaryService');

exports.createDiary = async (request, h) => {
    console.log('User Credentials:', request.auth.credentials); // Log user 
    const { date, content } = request.payload;

    try {
        const diaryId = await diaryService.createDiary({ date, content });
        return h.response({ diaryId }).code(201);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Failed to create diary' }).code(500);
    }
};

exports.getDiary = async (request, h) => {
    const { id } = request.params;

    try {
        const diary = await diaryService.getDiaryById(id);
        if (!diary) {
            return h.response({ error: 'Diary not found' }).code(404);
        }
        return h.response(diary).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Failed to fetch diary' }).code(500);
    }
};

exports.updateDiary = async (request, h) => {
    const { id } = request.params;
    const { date, content } = request.payload;

    try {
        const updated = await diaryService.updateDiary(id, { date, content });
        if (!updated) {
            return h.response({ error: 'Diary not found or update failed' }).code(404);
        }
        return h.response({ message: 'Diary updated successfully' }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Failed to update diary' }).code(500);
    }
};

exports.deleteDiary = async (request, h) => {
    const { id } = request.params;

    try {
        const deleted = await diaryService.deleteDiary(id);
        if (!deleted) {
            return h.response({ error: 'Diary not found or delete failed' }).code(404);
        }
        return h.response({ message: 'Diary deleted successfully' }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Failed to delete diary' }).code(500);
    }
};
