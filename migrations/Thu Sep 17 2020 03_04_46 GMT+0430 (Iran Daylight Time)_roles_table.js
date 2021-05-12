const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`
CREATE TABLE IF NOT EXISTS roles
(
    id         BIGSERIAL PRIMARY KEY,
    name       varchar(100) NOT NULL,
    is_deleted BOOL DEFAULT false
);
`);
const down = () => db.executeQuery('drop table roles');

module.exports = {
    up,
    down,
};
