const db = require('../../../core/db/postgresql');
const generateActivationCode = require('./generateActivationCode');

module.exports = async ({ phone_number }) => {
    const newCodeReqPeriod = 10 * 60 * 1000; // 10 minutes

    const record = await db.fetch({
        text: `
            select
                u.id, ac.created_at, u.is_deleted, ac.id as code_id, u.is_verified as is_verified, ac.number_of_tries as tries, ac.token as code
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
    // Check if it can create a new code.
    const canRequestForNewCode = (new Date() - Date.parse(record.created_at)) > newCodeReqPeriod;

    if (!canRequestForNewCode) {
        return false;
    }

    // Invalidate last code and create a new one.
    await db.updateQuery('activation_codes', {
        is_deleted: true,
    }, {
        id: record.code_id,
    });

    await generateActivationCode(record.id);

    return true;
};
