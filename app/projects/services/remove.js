/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


const fetch_project = async (id) => db.fetch({
    text: `SELECT id, name, owner_id, start_date, scheduled_end, address, area, is_multizoned
           FROM projects
           WHERE is_deleted = false AND id = $1`,
    values: [id],
});


const remove_project = async (id) => db.executeQuery({
    text: `UPDATE projects
           SET is_deleted= true
           WHERE id = $1`,
    values: [id],
});

module.exports = {
    fetch_project,
    remove_project,
};
