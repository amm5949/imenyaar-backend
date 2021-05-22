const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`
CREATE TABLE IF NOT EXISTS incident_photos
(
    id          SERIAL PRIMARY KEY,
    incident_id INT,
    name        VARCHAR(511),
    FOREIGN KEY (incident_id) REFERENCES incidents
);
`);
const down = () => db.executeQuery('drop table incident_photos');

module.exports = {
    up,
    down,
};
