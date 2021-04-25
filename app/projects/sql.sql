INSERT INTO resources(id, url, method)
VALUES (201, '/api/projects', 'post'),
       (202, '/api/projects', 'get'),
       (203, '/api/projects/:id', 'get'),
       (204, '/api/projects/:id', 'put'),
       (205, '/api/projects/:id', 'delete');

INSERT INTO accesses (resource_id, role_id)
VALUES (201, 2),
       (202, 2),
       (203, 2),
       (204, 2),
       (205, 2);
