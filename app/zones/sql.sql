INSERT INTO resources(id, url, method)
VALUES (301, '/api/zones', 'post'),
       (302, '/api/zones', 'get'),
       (303, '/api/zones/:id', 'get'),
       (304, '/api/zones/:id', 'put'),
       (305, '/api/zones/:id', 'delete');

INSERT INTO accesses (resource_id, role_id)
VALUES (301, 1),
       (302, 1),
       (303, 1),
       (304, 1),
       (305, 1);
