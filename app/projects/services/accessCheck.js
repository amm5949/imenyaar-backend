/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


const fetch_project = async (id) => db.fetch({
    text: `SELECT id, name, owner_id, start_date, scheduled_end, address, area, is_multizoned
           FROM projects
           WHERE is_deleted = false AND id = $1`,
    values: [id],
});
/* eslint-disable */

const fetch_user_role = async (user) => {
    const res = await db.fetch({
        text: `SELECT account_type_id as i
               FROM users
               WHERE is_deleted = FALSE
               AND id = $1`,
        values: [user.id],
    });
    if (res === undefined) {
        return null;
    }
    return user['i'] == 1;
};

const already_exist = async (project, id) => {
    const res = await db.fetch({
        text: `SELECT user_id, project_id
               FROM project_people
               WHERE project_id = $1
               AND user_id = $2`,
        values: [project, id],
    });
    return res != undefined;
};

const add_people = async (project, users) => {
    const return_val = {};
    let i = 0;
    for(const user of users) {
        if (await already_exist(project, user.id)) continue;
        const insertData = {
            user_id: user.id,
            project_id: project,
        };
        await db.insertQuery('project_people', insertData);
        i += 1;
    }
    return_val.added_people_count = i;
    return return_val;
};

module.exports = async (user, project) => {

    return false;
};
