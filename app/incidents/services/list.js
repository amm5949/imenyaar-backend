const db = require('../../../core/db/postgresql');

const getZone = async (id) => db.fetch({
    text: `SELECT *
           FROM zones
           WHERE id = $1`,
    values: [id],
});

const listIncidentsByZone = async (zoneID) => db.fetchAll({
    text: `SELECT *
           from incidents
           WHERE zone_id = $1 ORDER BY date DESC`,
    values: [zoneID],
});

module.exports = {
    getZone,
    listIncidentsByZone,
};
