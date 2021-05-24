/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


const fetch_project = async (id) => db.fetch({
    text: `SELECT id, name, owner_id, start_date, scheduled_end, address, area, is_multizoned
           FROM projects
           WHERE is_deleted = false AND id = $1`,
    values: [id],
});

const update_project = async (id, project_data) => {
    const res = await db.updateQuery('projects', project_data, { id });
    return res.rows;
};

module.exports = {
    fetch_project,
    update_project,
};
