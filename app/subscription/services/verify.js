const db = require('../../../core/db/postgresql');

const verify = async (id) => {
    const query = `
        UPDATE subscriptions
        SET is_verified =  true
        WHERE id = $1
    `;
    const res = (await db.insertOrUpdate({
        text: query,
        values: [id]
    })).rows[0];

    return res;
}

module.exports = verify;
