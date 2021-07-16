/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');

const fetch_activity = async (id, user) => db.fetch({
    text: `SELECT id, start_date, scheduled_end_date, project_id, people, zones, status, is_done
           FROM activities 
           WHERE is_deleted = false AND id = $1 AND ($2 in (select owner_id from projects where is_deleted=false and activities.project_id = projects.id) or $2 in (select user_id from user_roles u where u.role_id = 1 and is_deleted=false) or people @> $3 )`,
    values: [id, user.id, [user.id]],
});

module.exports = {
    fetch_activity,
};
