/*adding is_done boolean and is_deleted boolean*/
DROP TABLE IF EXISTS activities;
CREATE TABLE IF NOT EXISTS activities
(
    id                 SERIAL PRIMARY KEY,
    start_date          DATE,
    scheduled_end_date DATE,
    person_id          INT,
    status             VARCHAR(255),
    is_done            BOOLEAN,
    is_deleted         BOOLEAN,
    FOREIGN KEY (person_id) REFERENCES users
);


INSERT INTO resources(id, url, method)
VALUES (401, '/api/projects', 'post'),
       (402, '/api/projects', 'get'),
       (403, '/api/projects/:id', 'get'),
       (404, '/api/projects/:id', 'put'),
       (405, '/api/projects/:id', 'delete'),

INSERT INTO accesses (resource_id, role_id)
VALUES (401, 1),
       (402, 1),
       (403, 1),
       (404, 1),
       (405, 1),
       (401, 2),
       (402, 2),
       (403, 2),
       (404, 2),
       (405, 2),

