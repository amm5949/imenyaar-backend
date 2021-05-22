const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`
CREATE TABLE IF NOT EXISTS forget_password_tokens
(
    id           BIGSERIAL PRIMARY KEY,
    token        VARCHAR(12),
    user_id      BIGINT,
    is_deleted   BOOLEAN   DEFAULT FALSE,
    requested_at TIMESTAMP DEFAULT NOW(),
    is_active    BOOLEAN   DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users
);
`);
const down = () => db.executeQuery('drop table forget_password_tokens');

module.exports = {
    up,
    down,
};
