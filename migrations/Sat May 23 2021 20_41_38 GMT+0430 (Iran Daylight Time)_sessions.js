const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`
CREATE TABLE iF NOT EXISTS sessions
(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    token VARCHAR(32),
    uuid UUID,

    FOREIGN KEY (user_id) REFERENCES users
);
`);
const down = () => db.executeQuery('drop table sessions');

module.exports = {
    up,
    down,
};
