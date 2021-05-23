INSERT INTO resources(id, url, method)
VALUES (301, '/api/reports', 'post'),
       (302, '/api/reports', 'get'),
       (303, '/api/reports/:id', 'get'),
       (304, '/api/reports/:id/files', 'post');

INSERT INTO accesses (resource_id, role_id)
VALUES (301, 1),
       (302, 1),
       (303, 1),
       (304, 1),
       (301, 2),
       (302, 2),
       (303, 2),
       (304, 2)
       ;
