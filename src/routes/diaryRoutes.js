const diaryHandler = require('../handlers/diaryHandlers');

module.exports = [
    {
        method: 'POST',
        path: '/diaries',
        handler: diaryHandler.createDiary,
    },
    {
        method: 'GET',
        path: '/diaries/{id}',
        handler: diaryHandler.getDiary,
    },
    {
        method: 'PUT',
        path: '/diaries/{id}',
        handler: diaryHandler.updateDiary,
    },
    {
        method: 'DELETE',
        path: '/diaries/{id}',
        handler: diaryHandler.deleteDiary,
    },
];
