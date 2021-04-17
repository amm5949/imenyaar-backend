const db = require('../../../core/db/postgresql');
const auth = require('../../../core/auth/auth');

module.exports = (id) => {
    // const token = auth.genRandomString(8);
    const token = '00000000';
    return db.insertQuery('activation_codes', {
        user_id: id,
        token,
        created_at: new Date(),
    });
};
