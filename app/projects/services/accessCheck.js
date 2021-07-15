/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


const owns_project = async (id, user) => {
    const check = await db.fetch({
        text: `SELECT id as i
               FROM projects
               WHERE is_deleted = false AND id = $1 AND owner_id = $2`,
        values: [id, user.id],
    });
    if (check) {
        return true;
    }
    return false;
};
const check_user_role = async (user) => {
    const res = await db.fetch({
        text: `SELECT account_type_id as i
               FROM users
               WHERE is_deleted = FALSE
               AND id = $1`,
        values: [user.id],
    });
    if (res === undefined) {
        return false;
    }
    return res.i === 1;
};

module.exports = async (user, project) => {
    if (await owns_project(project, user) || await check_user_role(user)) {
        return true;
    }
    return false;
};
