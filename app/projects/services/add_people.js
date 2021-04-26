/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


const fetch_project = async (id) => db.fetch({
    text: `SELECT id, name, owner_id, start_date, scheduled_end, address, area, is_multizoned
           FROM projects
           WHERE is_deleted = false AND id = $1`,
    values: [id],
});
/* eslint-disable */

const fetch_user = async (users) => {
    for(const user in users) {
        const res = await db.fetch({
            text: `SELECT id, phone_number, first_name, last_name, is_active, is_verified, account_type_id
                   FROM users
                   WHERE is_deleted = FALSE
                     AND id = $1`,
            values: [user.id],
        });
        if (res === undefined) {
            return false;
        }
    }
    return true;
};

const already_exist = async (project, id) => {
    const res = await db.fetch({
        text: `SELECT user_id, project_id
               FROM project_people
               WHERE project_id = $1
               AND user_id = $2`,
        values: [project, user.id],
    });
    return res != undefined;
};

const add_people = async (project, users) => {
    const return_val = {};
    let i = 0;
    for(const user in users) {
        if (already_exist(project, user.id)) continue;
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

module.exports = {
    fetch_user,
    fetch_project,
    add_people,
};
