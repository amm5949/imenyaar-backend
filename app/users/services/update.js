const db = require('../../../core/db/postgresql');
const auth = require('../../../core/auth/auth');

const fetchUser = async (id) => db.fetch({
    text: `SELECT id, phone_number, first_name, last_name, is_active, is_verified, account_type_id
           FROM users
           WHERE is_deleted = true
             AND id = $1`,
    values: [id],
});


const getAccountType = async (id) => db.fetch({
    text: 'SELECT * FROM account_types WHERE id=$1',
    values: [id],
});

const updateUser = async (id, userData) => {
    const res = await db.insertOrUpdate({
        text: `UPDATE users
               SET first_name=$2,
                   last_name=$3,
                   account_type_id=$4
               WHERE id = $1
               RETURNING id,phone_number,first_name,last_name,account_type_id`,
        values: [id, userData.first_name, userData.last_name, userData.account_type_id],
    });
    return res.rows[0];
};

module.exports = {
    fetchUser,
    getAccountType,
    updateUser,
};
