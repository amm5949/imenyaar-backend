const db = require('../../../core/db/postgresql');
const auth = require('../../../core/auth/auth');
const getUser = async (phoneNumber) => db.fetch({
    text: 'SELECT * FROM users WHERE phone_number=$1',
    values: [phoneNumber],
});

const getAccountType = async (id) => db.fetch({
    text: 'SELECT * FROM account_types WHERE id=$1',
    values: [id],
});

const createUser = async (userData) => db.insertOrUpdate({
    text: `INSERT INTO users (phone_number, first_name, last_name, password_hash, account_type_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id,phone_number,first_name,last_name,account_type_id`,
    values: [userData.phoneNumber, userData.firstName, userData.lastName,
        auth.createHash(userData.password).passwordHash, userData.accountTypeID],
});

module.exports = {
    getUser,
    getAccountType,
    createUser,
};
