const db = require('../../../core/db/postgresql');

const getIncident = async (id) => db.fetch({
    text: 'SELECT * FROM incidents WHERE id=$1',
    values: [id],
});

const isUpdated = async (incidentID) => {
    const incident = await db.fetch({
        text: 'SELECT * FROM incidents WHERE previous_version=$1',
        values: [incidentID],
    });
    return incident !== undefined;
};

const updateIncident = async (data) => db.insertQuery('incidents', data);

module.exports = {
    getIncident,
    updateIncident,
    isUpdated,
};
