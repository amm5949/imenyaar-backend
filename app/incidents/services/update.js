const db = require('../../../core/db/postgresql');
const accessCheck = require('../../projects/services/accessCheck');

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

const checkAccess = async (user, incidentID) => {
    const { projectID } = await db.fetch({
        text: `SELECT p.id as projectID
               FROM incidents
                        join zones z on z.id = incidents.zone_id
                        join projects p on p.id = z.project_id`,
        values: [incidentID],
    });
    return accessCheck(user, projectID);
};

module.exports = {
    getIncident,
    updateIncident,
    isUpdated,
    checkAccess,
};
