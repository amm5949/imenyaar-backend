const debug = require('debug')('user:update');
const db = require('../../../core/db/postgresql');
const auth = require('../../../core/auth/auth');

const fetchUser = async (id) => db.fetch({
    text: `SELECT id, phone_number, first_name, last_name, is_active, is_verified, referer_id
           FROM users
           WHERE is_deleted = FALSE
            AND id = $1`,
    values: [id],
});


const updateUser = async (id, data) => {
    if (data.password !== undefined){
       data.password = auth.createHash(data.password).passwordHash;
    }
    const res = await db.updateQuery('users', data, {id: id});
    return res.rows;
};

module.exports = {
    fetchUser,
    updateUser,
};
