const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`
CREATE TABLE IF NOT EXISTS activities
(
    id                 SERIAL PRIMARY KEY,
    star_date          DATE,
    scheduled_end_date DATE,
    person_id          INT,
    status             VARCHAR(255),
    FOREIGN KEY (person_id) REFERENCES users
);

`);
const down = () => db.executeQuery('drop table ativities');

module.exports = {
    up,
    down,
};
