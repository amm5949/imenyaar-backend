const db = require('../../../core/db/postgresql');


const fetchUsers = async (filter) => {
    query = `
    SELECT u.id, u.first_name, u.last_name, u.phone_number,
    r.name as role, u.is_verified, u.referer_id
    FROM users as u
        LEFT JOIN user_roles as ur on ur.user_id = u.id 
        LEFT JOIN roles as r on r.id = ur.role_id
        WHERE u.is_deleted = false
    `;

    if (filter !== undefined){
        query +=  ` AND (u.first_name LIKE $1
                    OR u.last_name LIKE $1
                    OR u.phone_number LIKE $1
                    OR r.name LIKE $1 )`;            
    }
    const res = await db.executeQuery({
        text: query,
        values: (filter === undefined)? [] : [filter]
    });
    return res.rows;
};

module.exports = {
    fetchUsers,
};
