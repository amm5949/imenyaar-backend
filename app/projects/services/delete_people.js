/* eslint-disable */
const db = require('../../../core/db/postgresql');

const already_exist = async (project, id) => {
    const res = await db.fetch({
        text: `SELECT user_id, project_id
               FROM project_people
               WHERE project_id = $1
               AND user_id = $2
               AND is_deleted = FALSE`,
        values: [project, id],
    });
    return res != undefined;
};

const remove_people = async (project, users) => {
    const return_val = {};
    let i = 0;
    for(const user of users) {
        if (!(await already_exist(project, user.id))) continue;
            await db.executeQuery({
                text: `UPDATE project_people
                       SET is_deleted= true
                       WHERE user_id = $1 AND project_id = $2`,
                values: [user.id, project],
            });
        i += 1;
    }
    return_val.removed_people_count = i;
    return return_val;
};

module.exports = {
    remove_people,
};
