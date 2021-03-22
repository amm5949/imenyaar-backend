const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`CREATE TABLE IF NOT EXISTS resources(
    id BIGSERIAL PRIMARY KEY,
    url varchar(50) NOT NULL,
    method varchar(50) NOT NULL,
    is_deleted BOOL DEFAULT false
);`);
const down = () => db.executeQuery('drop table resources');

module.exports = {
    up,
    down,
};
