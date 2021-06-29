/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');
const auth = require('../../../core/auth/auth');
const generateActivationCode = require('./generateActivationCode');
// const { phone } = require('faker');

module.exports = async (user) => {
    const insertData = {
        ...user,
        is_verified: false,
        is_deleted: false,
        account_type_id: 2,
        password: auth.createHash(user.password).passwordHash,
    };

    // Check if the phone number already exists in the database.
    const phoneDuplicateCheck = await db.fetch({
        text: `
            SELECT u.id, ac.created_at, u.is_deleted, ac.id AS code_id, u.is_verified AS is_verified FROM users u
            LEFT JOIN
                activation_codes ac ON ac.user_id = u.id
            WHERE
                u.phone_number = $1
                AND u.is_deleted = false
                AND (
                    (ac.is_deleted IS NULL OR ac.is_deleted = false)
                    OR (password IS NULL)
                )
        `,
        values: [insertData.phone_number],
    });

    const validRegisterTime = 24 * 60 * 60 * 1000; // 24 hours
    const stillCanActivate = phoneDuplicateCheck
        ? (new Date() - Date.parse(phoneDuplicateCheck.created_at)) < validRegisterTime
        : false;
    // Check record exists
    // ... and it is not a deleted user
    // ... and it is active or if it's not, it still has time to activate.
    if (phoneDuplicateCheck !== undefined
        && (
            phoneDuplicateCheck.is_verified === true
            || (
                phoneDuplicateCheck.is_verified === false
                && stillCanActivate
            )
        )
    ) {
        return {
            duplicate: true,
        };
    }
    if (phoneDuplicateCheck === undefined) {
        return {
            unknown: true,
        };
    }

    const record = await db.updateQuery('users', insertData, { id: phoneDuplicateCheck.id });
    await db.insertQuery('user_roles', { user_id: record[0].id, role_id: 3 });

    // Generate a random token
    await generateActivationCode(phoneDuplicateCheck.id);
    // const token = (await db.fetch({
    //     text: `SELECT token FROM activation_codes WHERE user_id = $1`,
    //     values: [record.id]
    // })).token;
    // console.log(token, record.phone_number);
    // sms.send({template: 'verify', token: token, receptor: record.phone_number});
    
    return record;
};
