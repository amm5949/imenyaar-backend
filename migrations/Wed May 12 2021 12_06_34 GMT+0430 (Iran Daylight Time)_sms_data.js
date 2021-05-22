const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`
CREATE TABLE IF NOT EXISTS sms_data
(
    code          SERIAL PRIMARY KEY,
    creation_date TIMESTAMP DEFAULT NOW(),
    accepted      BOOLEAN   DEFAULT FALSE
);

`);
const down = () => db.executeQuery('drop table sms_data');

module.exports = {
    up,
    down,
};
