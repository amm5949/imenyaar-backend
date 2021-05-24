/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');

const fetch_zone = async (id) => db.fetch({
    text: `SELECT id, name, project_id, properties, details
           FROM zones
           WHERE is_deleted = false AND id = $1`,
    values: [id],
});

const fetch_project = async (id) => db.fetch({
    text: `SELECT id, name, owner_id, start_date, scheduled_end, address, area, is_multizoned
           FROM projects
           WHERE is_deleted = false AND id = $1`,
    values: [id],
});

const update_zone = async (id, zone_data) => {
    const res = await db.updateQuery('users', zone_data, { id });
    return res.rows;
};

module.exports = {
    fetch_project,
    fetch_zone,
    update_zone,
};
