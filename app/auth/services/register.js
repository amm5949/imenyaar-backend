const db = require('../../../core/db/postgresql');
const auth = require('../../../core/auth/auth');
const generateActivationCode = require('./generateActivationCode');
const sms = require('../../../core/util/sms');

module.exports = async (user) => {
    const insertData = {
        ...user,
        is_verified: false,
        is_deleted: false,
        account_type_id: 1,
        password: auth.createHash(user.password).passwordHash,
    };

    // Check if the phone number already exists in the database.
    const phoneDuplicateCheck = await db.fetch({
        text: `
            select u.id, ac.created_at, u.is_deleted, ac.id as code_id, u.is_verified as is_verified from users u
            left join
                activation_codes ac on ac.user_id = u.id
            where
                u.phone_number = $1
                and u.is_deleted = false
                and (ac.is_deleted IS NULL or ac.is_deleted = false)
        `,
        values: [insertData.phone_number],
    });

    const validRegisterTime = 24 * 60 * 60 * 1000; // 24 hours
    const stillCanActivate = phoneDuplicateCheck
        ? (new Date() - Date.parse(phoneDuplicateCheck.created_at)) < validRegisterTime
        : false;
    // Check record exists
    // ... and it is not a deleted user
    // ... and it is verified or if it's not, it still has time to activate.
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
            error: true,
        };
    }

    // Delete user if it is inactive and activation time has passed.
    // Also delete its activation code.
    if (phoneDuplicateCheck) {
        await db.updateQuery('users', { is_deleted: true }, { id: phoneDuplicateCheck.id });
        await db.updateQuery('activation_codes', { is_deleted: true }, { id: phoneDuplicateCheck.code_id });
    }
    const record = await db.insertQuery('users', insertData);
    await db.insertQuery('user_roles', { role_id: 2, user_id: record.id });
    // Generate a random token
    await generateActivationCode(record.id);
    const token = (await db.fetch({
        text: `SELECT token FROM activation_codes WHERE user_id = $1`,
        values: [record.id]
    })).token;
    sms.send('verify', token, parseInt(record.phone_number,10));

    return record;
};
