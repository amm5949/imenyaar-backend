const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`
CREATE TABLE IF NOT EXISTS accesses
(
    id          BIGSERIAL PRIMARY KEY,
    resource_id BIGINT NOT NULL,
    role_id     BIGINT NOT NULL,
    is_deleted  BOOL DEFAULT false,
    FOREIGN KEY (role_id) REFERENCES roles,
    FOREIGN KEY (resource_id) REFERENCES resources
);
`);
const down = () => db.executeQuery('drop table accesses;');

module.exports = {
    up,
    down,
};
