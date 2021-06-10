CREATE TABLE IF NOT EXISTS project_people
(
    id            SERIAL PRIMARY KEY,
    user_id      INT,
    project_id   INT,
    FOREIGN KEY (user_id) REFERENCES users,
    FOREIGN KEY (project_id) REFERENCES projects
);


INSERT INTO resources(id, url, method)
VALUES (201, '/api/projects', 'post'),
       (202, '/api/projects', 'get'),
       (203, '/api/projects/:id', 'get'),
       (204, '/api/projects/:id', 'put'),
       (205, '/api/projects/:id', 'delete'),
       (206, '/api/projects/addpeople/:id', 'post');

INSERT INTO accesses (resource_id, role_id)
VALUES (201, 1),
       (202, 1),
       (203, 1),
       (204, 1),
       (205, 1),
       (206, 1),
       (201, 2),
       (202, 2),
       (203, 2),
       (204, 2),
       (205, 2),
       (206, 2);
