CREATE TABLE IF NOT EXISTS subscriptions (
    id              serial primary key,
    start_date      timestamptz not null,
    end_date        timestamptz not null,
    cost            bigint not null,
    user_id         bigint not null,
    account_type_id bigint not null,
    FOREIGN key (user_id) REFERENCES users,
    FOREIGN key (account_type_id) REFERENCES account_types
);

INSERT INTO resources (id, url, method)
VALUES  (701, '/api/subscription', 'post'),
        (702, '/api/subscription/buy', 'post'),
        (703, '/api/subscription/verify', 'post'),
        (704, '/api/subscription/type/:id', 'put'),
        (705, '/api/subscription/type/:id', 'get'),
        (706, '/api/subscription/type', 'get'),
        (707, '/api/subscription/type/:id', 'delete')
        ;

INSERT INTO accesses (resource_id, role_id)
VALUES  (701, 1),
        (701, 2),
        (701, 3),
        (702, 1),
        (702, 2),
        (702, 3),
        (703, 1),
        (703, 2),
        (703, 3),
        (704, 1),
        (705, 1),
        (705, 2),
        (705, 3),
        (706, 1),
        (706, 2),
        (706, 3),
        (707, 1)
        ;
