INSERT INTO resources(id, url, method)
VALUES (801, '/api/zones', 'post'),
       (802, '/api/zones', 'get'),
       (803, '/api/zones/:id', 'get'),
       (804, '/api/zones/:id', 'put'),
       (805, '/api/zones/:id', 'delete');

INSERT INTO accesses (resource_id, role_id)
VALUES (801, 1),
       (802, 1),
       (803, 1),
       (804, 1),
       (805, 1),
       (801, 2),
       (802, 2),
       (803, 2),
       (804, 2),
       (805, 2);
