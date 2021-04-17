const db = require('../../../core/db/postgresql');
const auth = require('../../../core/auth/auth');
const fetchUser = require ('./fetch')


const getAccountType = async (id) => db.fetch({
    text: 'SELECT * FROM account_types WHERE id=$1',
    values: [id],
});

const createUser = async (userData) => db.insertOrUpdate({
    text: `INSERT INTO users (phone_number, first_name, last_name, password, account_type_id)
           VALUES ($1, $2, $3, $4, $5)`,
    values: [userData.phone_number, userData.first_name, userData.last_name,
        auth.createHash(userData.password).passwordHash, userData.account_type_id],
});

module.exports = {
    getAccountType,
    createUser,
};
