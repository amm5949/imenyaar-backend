const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`
CREATE TABLE IF NOT EXISTS reports
(
    id          SERIAL PRIMARY KEY,
    activity_id INT,
    -- TODO add report details
    FOREIGN KEY (activity_id) REFERENCES activities
);
`);
const down = () => db.executeQuery('drop table reports');

module.exports = {
    up,
    down,
};
