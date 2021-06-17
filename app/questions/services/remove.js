const db = require('../../../core/db/postgresql');

const fetchQuestion = async (id) => db.fetch({
    text: 'SELECT * FROM questions WHERE id=$1',
    values: [id],
});

const getAnswerCount = async (id) => db.fetch({
    text: `SELECT COUNT(a.id)
           from questions q
                    join answers a on q.id = a.question_id
           where q.id = $1`,
    values: [id],
});

const deleteQuestion = async (id) => {
    const queries = ['DELETE FROM links WHERE question_id = $1',
        'DELETE FROM options WHERE question_id = $1',
        'DELETE FROM question_images WHERE question_id = $1',
        'DELETE FROM questions WHERE id = $1'];
    await queries.forEach((q) => db.executeQuery({ text: q, values: [id] }));
};

module.exports = {
    deleteQuestion,
    fetchQuestion,
    getAnswerCount,
};
