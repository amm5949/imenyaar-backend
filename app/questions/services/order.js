const db = require('../../../core/db/postgresql');

const getQuestionsOrdered = async (categoryID) => db.fetchAll({
    text: `SELECT q.id, q.list_order, q.title, q.paragraph, c.name
           FROM questions q
                    JOIN categories c on q.category_id = c.id
           WHERE c.id = $1
           ORDER BY q.list_order, q.id`,
    values: [categoryID],
});

module.exports = {
    getQuestionsOrdered,
};
