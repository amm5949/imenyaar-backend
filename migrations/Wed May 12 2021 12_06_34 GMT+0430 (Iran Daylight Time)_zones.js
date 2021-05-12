const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`
CREATE TABLE IF NOT EXISTS zones
(
    id         SERIAL PRIMARY KEY,
    project_id INT,
    name       VARCHAR(127) NOT NULL,
    properties VARCHAR(255) NOT NULL,
    details    VARCHAR(255) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (project_id) REFERENCES projects
);
`);
const down = () => db.executeQuery('drop table zones');

module.exports = {
    up,
    down,
};
