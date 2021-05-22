const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`
CREATE TABLE IF NOT EXISTS user_roles
(
    id         BIGSERIAL PRIMARY KEY,
    role_id    BIGINT NOT NULL,
    user_id    BIGINT NOT NULL,
    is_deleted BOOL DEFAULT false,
    FOREIGN KEY (role_id) REFERENCES roles,
    FOREIGN KEY (user_id) REFERENCES users
);
`);
const down = () => db.executeQuery('drop table user_roles');

module.exports = {
    up,
    down,
};
