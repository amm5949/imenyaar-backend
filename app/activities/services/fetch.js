/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');
// const projectCheckAccess = require('../../projects/services/checkAccess');

const fetch_activity = async (id) => db.fetch({
    text: `SELECT id, start_date, scheduled_end_date, person_id, status, is_done
           FROM activities
           WHERE is_deleted = false AND id = $1`,
    values: [id],
});

const checkAccess = async (userId, activityId) => {

    const projectId = (await db.fetch({
        text: `SELECT project_id FROM activities a
        WHERE a.id = $1`,
        values: [activityId]
    })).project_id;

    const access = (await projectCheckAccess(userId, projectId));

    return access;
}

module.exports = {
    fetch_activity,
    checkAccess,
};
