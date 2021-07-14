-- FIXME: change id prefix to 80x
INSERT INTO resources (id, url, method)
VALUES (701, '/api/incidents', 'post'),
       (702, '/api/incidents/list/:zone_id', 'get'),
       (703, '/api/incidents/fetch/:incident_id', 'get'),
       (704, '/api/incidents/:incident_id', 'put');

INSERT INTO accesses(resource_id, role_id)
VALUES (701, 1),
       (702, 1),
       (703, 1),
       (704, 1),
       (701, 2),
       (702, 2),
       (703, 2),
       (704, 2);

