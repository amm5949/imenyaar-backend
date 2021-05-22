/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');

module.exports = async ({ phone_number, code }) => {
    const validRegisterTime = 24 * 60 * 60 * 1000; // 24 hours

    const record = await db.fetch({
        text: `
            select
                u.id, ac.created_at, u.is_deleted, ac.id as code_id, u.is_active as is_active, ac.number_of_tries as tries, ac.token as code
            from users u
            inner join
                activation_codes ac on ac.user_id = u.id
            where
                u.phone_number = $1
                and u.is_deleted = false
                and ac.is_deleted = false
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
