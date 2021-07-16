/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


const fetch_project = async (id) => {
    const project = await db.fetch({
        text: `SELECT id, name, owner_id, start_date, scheduled_end, address, area, is_multizoned
            FROM projects
            WHERE is_deleted = false AND id = $1`,
        values: [id],
    });
    project.is_active = await checkActivity(id);
    return project;
}

// check for project activity status,
// project is active if it's had a report or incident in the past week
const checkActivity = async (id) => {
    const date = {};
    date.now = new Date();
    date.lastWeek = new Date();
    date.lastWeek.setDate(date.lastWeek.getDate() - 7);

    const project = await db.fetch({
        text: `SELECT p.* FROM projects p
        inner join zones z on z.project_id = p.id
        left join reports r on r.zone_id = z.id
        left join incidents i on i.zone_id = z.id
        WHERE p.id = $1
        AND
        ((i.date >= $2 AND i.date <= $3)
            OR
        (r.creation_date >= $2 AND r.creation_date <= $3))
        `,
        values: [id, date.lastWeek, date.now]
    })

    return (project !== undefined);
}

module.exports = {
    fetch_project,
    checkActivity,
};
