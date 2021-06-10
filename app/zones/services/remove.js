/* eslint-disable camelcase */
const db = require('../../../core/db/postgresql');


const fetch_zone = async (id) => db.fetch({
    text: `SELECT id, name, project_id, properties, details
           FROM zones
           WHERE is_deleted = false AND id = $1`,
    values: [id],
});


const remove_zones = async (id) => db.executeQuery({
    text: `UPDATE zones
           SET is_deleted= true
           WHERE id = $1`,
    values: [id],
});

module.exports = {
    fetch_zone,
    remove_zones,
};
