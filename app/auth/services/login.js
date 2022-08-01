/* eslint-disable camelcase */
const { v4: uuidv4 } = require('uuid');
const db = require('../../../core/db/postgresql');
const auth = require('../../../core/auth/auth');

module.exports = async ({ phone_number, password, extendSession }) => {
    // Get the user record from the database by phone number
    const record = await db.fetch({
        text: 'SELECT * FROM users WHERE phone_number = $1 AND is_deleted = false AND is_active = true',
        values: [phone_number],
    });


    // Check if the user exists
    if (record === undefined) {
        return false;
    }

    // Compare given password with the password hash
    const passwordCheckResult = auth.verifyPassword(password, record.password);

    // Wrong password
    if (!passwordCheckResult) {
        return false;
    }

    // Return user data with a signed token
    // set session duration (either 3 or 5) depending on extension
    const refreshTokenExp = extendSession? auth.DAY * 5 : auth.DAY * 3;
    const refreshTokenVal = auth.genRandomString(32);
    const sessionId = uuidv4();
    await db.insertQuery('sessions', {
        user_id: record.id,
        token: refreshTokenVal,
        uuid: sessionId,
    });

    const accessToken = auth.signToken({
        id: record.id,
        session_id: sessionId,
    }, { exp: auth.YEAR });

    const refreshToken = auth.signToken({
        id: record.id,
        session_id: sessionId,
        token: refreshTokenVal,
    }, { exp: refreshTokenExp });

    return {
        ...Object.fromEntries(
            Object.entries(record)
                .filter(([field]) => [
                    'id',
                    'phone_number',
                    'first_name',
                    'last_name',
                ].indexOf(field) > 0),
        ),
        tokens: {
            access_token: accessToken,
            refresh_token: refreshToken,
        },
    };
};
