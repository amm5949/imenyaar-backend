/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');

module.exports = async ({ phone_number, code }) => {
    const validRegisterTime = 24 * 60 * 60 * 1000; // 24 hours

    const record = await db.fetch({
        text: `
            SELECT
                u.id, ac.created_at, u.is_deleted, ac.id AS code_id, u.is_active AS is_active, ac.number_of_tries AS tries, ac.token AS code
            FROM users u
            INNER JOIN
                activation_codes ac ON ac.user_id = u.id
            WHERE
                u.phone_number = $1
                AND u.is_deleted = false
                AND ac.is_deleted = false
        `,
        values: [phone_number],
    });

    if (!record) {
        return false;
    }

    const stillCanActivate = (new Date() - Date.parse(record.created_at)) < validRegisterTime;
    // Increment tries by 1
    const tries = record.tries + 1;
    // If code has been tried 5 times or activation time has passed delete it,
    // otherwise increment tries.
    if (tries === 5 || !stillCanActivate) {
        await db.updateQuery('activation_codes', {
            is_deleted: true,
        }, {
            id: record.code_id,
        });
    } else {
        await db.updateQuery('activation_codes', {
            number_of_tries: tries,
        }, {
            id: record.code_id,
        });
    }
    // Validate code
    if (code !== record.code || !stillCanActivate) {
        return false;
    }

    // Activate user
    await db.updateQuery('users', {
        is_verified: true,
    }, {
        id: record.id,
    });

    return true;
};
