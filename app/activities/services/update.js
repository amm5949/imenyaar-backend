/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');

const fetch_activity = async (id) => db.fetch({
    text: `SELECT id, start_date, scheduled_end_date, people, zones, project_id, status, is_done
           FROM activities
           WHERE is_deleted = false AND id = $1`,
    values: [id],
});

const update_activity = async (id, activity_data) => {
    const res = await db.updateQuery('activities', activity_data, { id });
    return res.rows;
};

module.exports = {
    fetch_activity,
    update_activity,
};
