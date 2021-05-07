const db = require('../../../core/db/postgresql');

const fetchUser = async (id) => db.fetch({
    text: `SELECT id, phone_number, first_name, last_name, is_active, is_verified, account_type_id
           FROM users
           WHERE is_deleted = FALSE
             AND id = $1`,
    values: [id],
});

const removeUser = async (id) => db.updateQuery('users', {is_deleted: true}, {id : id});

module.exports = {
    fetchUser,
    removeUser,
};
