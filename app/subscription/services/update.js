const db = require('../../../core/db/postgresql');

module.exports = async (data, id) => {
    const record = await db.updateQuery('account_types', data, {id});
    return record;
};
