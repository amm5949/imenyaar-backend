/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');
const auth = require('../../../core/auth/auth');


const phoneDuplicateCheck = async (phone_number) => db.fetch({
    text: 'SELECT id FROM users WHERE phone_number = $1 AND is_deleted = false',
    values: [phone_number],
});

module.exports = async (user) => {
    const insertData = {
        ...user,
        is_verified: false,
        is_deleted: false
    };

    if (await phoneDuplicateCheck(insertData.phone_number) !== undefined) {
        return {
            error: true,
        };
    }

    const record = await db.insertQuery('users', insertData);
    return record;
};
