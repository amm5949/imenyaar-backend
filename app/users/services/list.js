const db = require('../../../core/db/postgresql');


const fetchUsers = async () => {
    const res = await db.executeQuery({
        text: `SELECT u.id, u.first_name, u.last_name, u.phone_number, u.account_type_id, r.name as role, u.is_verified
               FROM users as u
               LEFT JOIN user_roles as ur on ur.user_id = u.id 
               LEFT JOIN roles as r on r.id = ur.role_id
               WHERE u.is_deleted = false`,
        values: [],
    });
    return res.rows;
};

module.exports = {
    fetchUsers,
};
