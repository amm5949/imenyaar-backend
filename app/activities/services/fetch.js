/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');

const fetch_activity = async (id, user) => db.fetch({
    text: `SELECT a.*
           FROM activities a
           WHERE is_deleted = false 
           AND id = $1 
           AND (
               $2 in (select owner_id from projects p where is_deleted=false and a.project_id = p.id) 
               OR $2 in (select user_id from user_roles u where u.role_id = 1 and is_deleted=false) 
               OR $2 = ANY(a.people)
            )`,
    values: [id, user.id],
});

module.exports = {
    fetch_activity,
};
