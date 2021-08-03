const db = require('../../../core/db/postgresql');

module.exports = async (id) => {
    const record = await db.executeQuery({
        text: `DELETE FROM account_types WHERE id = $1 RETURNING *`,
        values: [id]
    }).catch(e => {
        return {error: 'cannot delete this type.', e};
    });
    return record;
};
