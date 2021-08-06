const db = require('../../../core/db/postgresql');

const verify = async (id, refId) => {
    const query = `
        UPDATE subscriptions
        SET is_verified =  true,
        ref_id = $2
        WHERE id = $1
    `;
    const res = (await db.insertOrUpdate({
        text: query,
        values: [id, refId]
    })).rows[0];

    return res;
}

module.exports = verify;
