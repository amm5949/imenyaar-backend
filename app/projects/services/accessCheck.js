/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');

const is_added_to_project = async (user, project) => {
    const check = await db.fetch({
        text: `SELECT id as i
               FROM project_people
               WHERE is_deleted = false AND project_id = $1 AND user_id = $2`,
        values: [project, user.id],
    });
    if (check) {
        return true;
    }
    return false;
};

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
        text: `SELECT role_id
               FROM user_roles
               WHERE is_deleted = FALSE
               AND user_id = $1
               ORDER BY role_id ASC`,
        values: [user.id],
    });
    if (res === undefined) {
        return false;
    }
    return res.role_id;
};

// acceptable types = {fetch, edit}
module.exports = async (user, project, type='edit') => {
    if (await owns_project(project, user) || (await check_user_role(user)) == 1) {
        return true;
    }
    if (type === 'fetch' && await is_added_to_project(user, project)) {
        return true;
    }
    return false;
};
