const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`
CREATE TABLE IF NOT EXISTS project_people
(
    id            SERIAL PRIMARY KEY,
    user_id      INT,
    project_id   INT,
    FOREIGN KEY (user_id) REFERENCES users,
    FOREIGN KEY (project_id) REFERENCES projects
);
`);
const down = () => db.executeQuery('drop table project_people');

module.exports = {
    up,
    down,
};
