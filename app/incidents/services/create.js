const db = require('../../../core/db/postgresql');

const getZone = async (id) => db.fetch({
    text: `SELECT *
           FROM zones
           WHERE id = $1`,
    values: [id],
});

const insertIncident = async (data) => db.insertQuery('incidents', data);

module.exports = {
    getZone,
    insertIncident,
};
