const db = require('../../../core/db/postgresql');


const fetchUsers = async () => {
    const res = await db.executeQuery({
        text: `SELECT id
               FROM users
               WHERE is_deleted = false`,
        values: [],
    });
    return res.rows;
};

module.exports = {
    fetchUsers,
};
