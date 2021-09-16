/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


const fetch_activity = async (id) => db.fetch({
    text: `SELECT *
           FROM activities
           WHERE is_deleted = false AND id = $1`,
    values: [id],
});

const remove_activity = async (id) => db.executeQuery({
    text: `UPDATE activities
           SET is_deleted= true
           WHERE id = $1`,
    values: [id],
});

module.exports = {
    fetch_activity,
    remove_activity,
};
