const db = require('../../../core/db/postgresql');


module.exports = async (id) => {
    const result = await db.fetch({ 
        text: `SELECT * FROM account_types WHERE id = $1`, 
        values: [id]
    });
    return result;
}
