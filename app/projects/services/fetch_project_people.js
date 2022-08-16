/* eslint-disable */
const db = require('../../../core/db/postgresql');


const fetch_project = async (id) => db.fetch({
    text: `SELECT id, name, owner_id, start_date, scheduled_end, address, area, is_multizoned
           FROM projects
           WHERE is_deleted = false AND id = $1`,
    values: [id],
});

const fetch_people = async (_project) => {
    const project = await fetch_project(_project);
    project.people = [];
    const people = await db.executeQuery({
        text: `SELECT p.user_id, u.first_name, u.last_name
               FROM project_people p
               INNER JOIN users u ON u.id = p.user_id
               WHERE project_id = $1 AND p.is_deleted = FALSE`,
        values: [_project],
    });
    for (const p of people.rows) {
        const person = {
            id: p.user_id,
            fist_name: p.first_name,
            last_name: p.last_name
        }
        project.people.push(person);
    }
    return project;
};

module.exports = {
    fetch_project,
    fetch_people
};

