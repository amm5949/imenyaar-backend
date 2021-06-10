INSERT INTO resources(id, url, method)
VALUES (501, '/api/categories', 'post'),
       (502, '/api/categories', 'get');

INSERT INTO accesses (resource_id, role_id)
VALUES  (501, 1),
        (502, 1),
        (502, 2),
        (502, 3);
