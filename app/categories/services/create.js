const db = require('../../../core/db/postgresql');

module.exports = async (data) => {
    const record = await db.insertQuery('categories', data);
    return record;
};
