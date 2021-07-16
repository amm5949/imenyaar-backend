const db = require('../../../core/db/postgresql');

const fetchIncident = async (incidentID) => db.fetchAll(
    {
        text: `WITH RECURSIVE incs AS (SELECT *
                                       FROM incidents
                                       WHERE id = $1
                                       UNION
                                       SELECT i.*
                                       FROM incidents i
                                                INNER JOIN incidents p ON i.previous_version = p.id)
               SELECT *
               FROM incs ORDER BY date`,
        values: [incidentID],
    },
);

module.exports = {
    fetchIncident,
};
