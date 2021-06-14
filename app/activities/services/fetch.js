/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


const fetch_activity = async (id) => db.fetch({
    text: `SELECT id, start_date, scheduled_end_date, person_id, status, is_done,
           FROM activities
           WHERE is_deleted = false AND id = $1`,
    values: [id],
});

module.exports = {
    fetch_activity,
};
