-- FIXME: change id prefix to 80x
ALTER TABLE incidents ADD user_id bigint;
ALTER TABLE incidents add constraint user_id_fkey
		foreign key (user_id) references users;
ALTER TABLE incidents alter column date type 
    varchar(28) using date::varchar(28);

INSERT INTO resources (id, url, method)
VALUES (801, '/api/incidents', 'post'),
       (802, '/api/incidents/list/:zone_id', 'get'),
       (803, '/api/incidents/fetch/:incident_id', 'get'),
       (804, '/api/incidents/:incident_id', 'put');
       
INSERT INTO accesses(resource_id, role_id)
VALUES (801, 1),
       (802, 1),
       (803, 1),
       (804, 1),
       (801, 2),
       (802, 2),
       (803, 2),
       (804, 2),
       (801, 3),
       (802, 3),
       (803, 3),
       (804, 3);

