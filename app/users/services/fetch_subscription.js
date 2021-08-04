const db = require('../../../core/db/postgresql');


module.exports = async (id) => {
    const record = await db.fetch({
        text: `SELECT at.*, s.id, s.start_date, s.end_date
            FROM subscriptions s
            INNER JOIN account_types at ON at.id = s.account_type_id
            WHERE s.user_id = $1
            AND start_date <= $2
            AND end_date >= $2
            AND is_verified = true
            ORDER BY s.end_date
            `,
        values: [id, new Date()],
    });
    return record;

}
