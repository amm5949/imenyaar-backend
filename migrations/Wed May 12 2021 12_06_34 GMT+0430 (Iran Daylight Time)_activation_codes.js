const db = require('../core/db/postgresql');

const up = () => db.executeQuery(`
create table IF NOT EXISTS activation_codes
(
    id              bigserial primary key,
    user_id         bigint not null,
    token           varchar(8),
    number_of_tries int     default 0,
    created_at      varchar(100),
    is_deleted      boolean default false
);
`);
const down = () => db.executeQuery('drop table activation_codes');

module.exports = {
    up,
    down,
};
