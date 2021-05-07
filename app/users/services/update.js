const debug = require('debug')('user:update');
const db = require('../../../core/db/postgresql');
const auth = require('../../../core/auth/auth');

const fetchUser = async (id) => db.fetch({
    text: `SELECT id, phone_number, first_name, last_name, is_active, is_verified, referer_id, account_type_id
           FROM users
           WHERE is_deleted = FALSE
            AND id = $1`,
    values: [id],
});

const getAccountType = async (id) => db.fetch({
    text: 'SELECT * FROM account_types WHERE id=$1',
    values: [id],
});

const updateUser = async (id, data) => {
    const res = await db.updateQuery('users', data, {id: id});
    return res.rows;
};

module.exports = {
    fetchUser,
    getAccountType,
    updateUser,
};
