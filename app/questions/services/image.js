const db = require('../../../core/db/postgresql');

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
};
