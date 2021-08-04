const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`CREATE TABLE IF NOT EXISTS users(
    id              SERIAL PRIMARY KEY,
    phone_number    VARCHAR(15)  NOT NULL,
    first_name      VARCHAR(63)  NOT NULL,
    last_name       VARCHAR(63)  NOT NULL,
    password        VARCHAR(511),
    is_verified     BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    is_deleted      BOOLEAN DEFAULT FALSE,
    referer_id      INT DEFAULT NULL
);`);
const down = () => db.executeQuery('drop table users');

module.exports = {
    up,
    down,
};
