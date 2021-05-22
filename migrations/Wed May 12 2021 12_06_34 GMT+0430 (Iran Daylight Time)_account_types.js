const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`
CREATE TABLE IF NOT EXISTS account_types
(
    id                    SERIAL PRIMARY KEY,
    name                  VARCHAR(63),
    allowed_project_count INT     DEFAULT 1,
    person_per_project    INT     DEFAULT 1,
    duration_days         INT     DEFAULT 365,
    can_incident          BOOLEAN DEFAULT FALSE,
    can_sync              BOOLEAN DEFAULT FALSE,
    price                 INT NOT NULL
);
`);
const down = () => db.executeQuery('drop table account_types');

module.exports = {
    up,
    down,
};
