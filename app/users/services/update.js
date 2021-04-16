const debug = require('debug')('user:update');
const db = require('../../../core/db/postgresql');
const auth = require('../../../core/auth/auth');

const fetchUser = async (id) => db.fetch({
    text: `SELECT id, phone_number, first_name, last_name, is_active, is_verified, account_type_id
           FROM users
           WHERE is_deleted = FALSE
             AND id = $1`,
    values: [id],
});

const getAccountType = async (id) => db.fetch({
    text: 'SELECT * FROM account_types WHERE id=$1',
    values: [id],
});

const updateUser = async (id, userData) => {
    let text = `UPDATE users
                SET first_name=$2,
                    last_name=$3,
                    account_type_id=$4`;
    const values = [id, userData.first_name, userData.last_name, userData.account_type_id];
    if (userData.password !== undefined) {
        text += ' ,password=$5 ';
        values.push(auth.createHash(userData.password).passwordHash);
    }
    text += ' WHERE id=$1 ';
    debug('update query: ', text);
    const res = await db.insertOrUpdate({ text, values });
    return res.rows[0];
};

module.exports = {
    fetchUser,
    getAccountType,
    updateUser,
};
