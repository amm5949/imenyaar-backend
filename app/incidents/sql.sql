-- FIXME: change id prefix to 80x
ALTER TABLE incidents ADD user_id bigint;
ALTER TABLE incidents add constraint user_id_fkey
		foreign key (user_id) references users;
ALTER TABLE incidents alter column date type 
    varchar(28) using date::varchar(28);

INSERT INTO resources (id, url, method)
VALUES (901, '/api/incidents', 'post'),
       (902, '/api/incidents/list/:zone_id', 'get'),
       (903, '/api/incidents/fetch/:incident_id', 'get'),
       (904, '/api/incidents/:incident_id', 'put');
       
INSERT INTO accesses(resource_id, role_id)
VALUES (901, 1),
       (902, 1),
       (903, 1),
       (904, 1),
       (901, 2),
       (902, 2),
       (903, 2),
       (904, 2),
       (901, 3),
       (902, 3),
       (903, 3),
       (904, 3);

