const db = require('../../../core/db/postgresql');

const fetchUser = async (id) => db.fetch({
    text: `SELECT id, phone_number, first_name, last_name, is_active, is_verified, account_type_id
           FROM users
           WHERE is_deleted = false AND id = $1`,
    values: [id],
});

module.exports = {
    fetchUser,
};
