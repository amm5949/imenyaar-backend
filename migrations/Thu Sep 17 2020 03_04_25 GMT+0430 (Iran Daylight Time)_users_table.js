const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`CREATE TABLE IF NOT EXISTS users(
    id BIGSERIAL PRIMARY KEY,
    username varchar(50) NOT NULL,
    password varchar(191) NOT NULL,
    first_name varchar(50),
    last_name varchar(50),
    creator_id BIGINT default null,
    is_active BOOL DEFAULT TRUE,
    is_deleted BOOL DEFAULT FALSE
);`);
const down = () => db.executeQuery('drop table users');

module.exports = {
    up,
    down,
};
