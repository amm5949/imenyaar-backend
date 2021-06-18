const db = require('../../../core/db/postgresql');

module.exports = async () => (accountTypes = await db.fetchAll({
        text: `SELECT * FROM account_types`
    }));

