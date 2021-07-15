alter table activities add column people INT[];

alter table activities add column zones INT[];

alter table activities add column project_id int;

alter table activities add constraint project_id FOREIGN KEY (project_id) REFERENCES projects;


CREATE TABLE activities
(
    id                  SERIAL PRIMARY KEY,
    project_id          INT,
    start_date          DATE,
    scheduled_end_date  DATE,
    people              INT[],
    zones               INT[],
    status              INT,
    is_done             BOOLEAN default false,
    is_deleted          BOOLEAN default false,
    FOREIGN KEY (project_id) REFERENCES projects
);

INSERT INTO resources(id, url, method)
VALUES (401, '/api/activities', 'post'),
       (402, '/api/activities', 'get'),
       (403, '/api/activities/:id', 'get'),
       (404, '/api/activities/:id', 'put'),
       (405, '/api/activities/:id', 'delete');

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
       (405, 2);

