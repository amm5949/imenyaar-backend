const db = require('../../../core/db/postgresql');

module.exports = async (data) => {
    const record = await db.insertQuery('account_types', data);
    return record;
};
