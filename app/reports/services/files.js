const db = require('../../../core/db/postgresql');

module.exports = async (reportId, images, voices) => {
    const answers = await db.fetchAll({
        text: 'SELECT id, question_id FROM answers WHERE report_id = $1',
        values: [reportId],
    });
    if (images.length > 0) {
        db.insertQuery('answer_images', images.map(
            ({ path, questionId }) => ({
                path,
                answer_id: answers.find((answer) => answer.question_id === parseInt(questionId, 10)).id,
            }),
        ));
    }

    if (voices.length > 0) {
        db.insertQuery('answer_voices', voices.map(({ path, questionId }) => ({
            path,
            answer_id: answers.find((answer) => answer.question_id === parseInt(questionId, 10)).id,
        })));
    }
};
