const db = require('../../../core/db/postgresql');

const fetchQuestion = async (id) => db.fetch({
    text: 'SELECT * FROM questions WHERE id=$1',
    values: [id],
});

/**
 * @param {Number} id
 * @param {Array} paths
 * @returns {*}
 */
const save = (id, paths) => {
    const images = paths.map((path) => ({
        path,
        question_id: id,
    }));

    return db.insertQuery('question_images', images);
};

module.exports = {
    save,
    fetchQuestion,
};
