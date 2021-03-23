const db = require('../../../core/db/postgresql');
const auth = require('../../../core/auth/auth');

module.exports = async ({ username, password }) => {
    // Get the user record from the database by username
    const record = await db.fetch({
        text: 'SELECT * FROM users WHERE username = $1 AND is_deleted = false AND is_active = true',
        values: [username],
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
    const user = {
        ...Object.fromEntries(
            Object.entries(record).filter(([field]) => {
                return [
                    'id',
                    'username',
                    'first_name',
                    'last_name',
                ].indexOf(field) > 0;
            }),
        ),
        token: auth.signToken({
            id: record.id,
        }),
    };
    return user;
};
