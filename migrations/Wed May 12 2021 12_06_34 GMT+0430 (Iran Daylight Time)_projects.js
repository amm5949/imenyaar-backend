const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`
CREATE TABLE IF NOT EXISTS projects
(
    id            SERIAL PRIMARY KEY,
    name          varchar(255),
    owner_id      INT,
    start_date    DATE,
    scheduled_end DATE,
    address       VARCHAR(1023),
    area          FLOAT,
    is_multizoned BOOLEAN DEFAULT FALSE,
    is_deleted    BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (owner_id) REFERENCES users
);
`);
const down = () => db.executeQuery('drop table projects');

module.exports = {
    up,
    down,
};
