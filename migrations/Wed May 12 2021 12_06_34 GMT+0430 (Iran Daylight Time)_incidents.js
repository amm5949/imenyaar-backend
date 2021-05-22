const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`
CREATE TABLE IF NOT EXISTS incidents
(
    id               SERIAL PRIMARY KEY,
    zone_id          INT,
    type             VARCHAR(127)  NOT NULL,
    financial_damage INT DEFAULT 0 NOT NULL,
    human_damage     INT DEFAULT 0 NOT NULL,
    date             DATE          NOT NULL,
    description      VARCHAR(2047) NOT NULL,
    hour             INT           NOT NULL,
    reason           VARCHAR(255)  NOT NULL,
    FOREIGN KEY (zone_id) REFERENCES zones
);
`);
const down = () => db.executeQuery('drop table incidents');

module.exports = {
    up,
    down,
};
