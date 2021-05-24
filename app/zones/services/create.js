/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');

const fetch_project = async (id) => db.fetch({
    text: `SELECT id, name, owner_id, start_date, scheduled_end, address, area, is_multizoned
           FROM projects
           WHERE is_deleted = false AND id = $1`,
    values: [id],
});

const create_zone =  async (zone_details) => {
    const insertData = {
        ...zone_details,
        is_deleted: false,
    };

    const record = await db.insertQuery('zones', insertData);
    return record;
};

module.exports = {
    fetch_project,
    create_zone,
};
