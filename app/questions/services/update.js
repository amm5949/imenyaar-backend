const db = require('../../../core/db/postgresql');

const fetchQuestion = async (id) => db.fetch({
    text: 'SELECT * FROM questions WHERE id=$1',
    values: [id],
});

const updateQuestion = async (question, id) => db.updateQuery('questions', question, { id });

module.exports = {
    fetchQuestion,
    updateQuestion,
};
