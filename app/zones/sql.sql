CREATE TABLE IF NOT EXISTS projects
(
    id            SERIAL PRIMARY KEY,
    name          varchar(255),
    owner_id      INT,
    start_date    DATE,
    scheduled_end DATE,
    address       VARCHAR(1023),
    area          FLOAT,
    is_multizoned BOOLEAN DEFAULT FALSE,
    is_deleted    BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (owner_id) REFERENCES users
);

CREATE TABLE IF NOT EXISTS zones
(
    id         SERIAL PRIMARY KEY,
    project_id INT,
    name       VARCHAR(127) NOT NULL,
    properties VARCHAR(255) NOT NULL,
    details    VARCHAR(255) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (project_id) REFERENCES projects
);

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
