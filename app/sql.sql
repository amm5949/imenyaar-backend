-- CREATE TYPE USER_TYPE AS ENUM ('bronze', 'silver', 'gold');

CREATE TABLE IF NOT EXISTS account_types
(
    id                    SERIAL PRIMARY KEY,
    name                  VARCHAR(63),
    allowed_project_count INT     DEFAULT 1,
    person_per_project    INT     DEFAULT 1,
    duration_days         INT     DEFAULT 365,
    can_incident          BOOLEAN DEFAULT FALSE,
    can_sync              BOOLEAN DEFAULT FALSE,
    price                 INT NOT NULL
);


-- TODO handle subusers
CREATE TABLE IF NOT EXISTS users
(
    id              SERIAL PRIMARY KEY,
    phone_number    VARCHAR(15)  NOT NULL,
    first_name      VARCHAR(63)  NOT NULL,
    last_name       VARCHAR(63)  NOT NULL,
    password        VARCHAR(511),
    account_type_id INT     DEFAULT NULL,
    is_verified     BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    is_deleted      BOOLEAN DEFAULT FALSE,
    referer_id      INT DEFAULT NULL,
    FOREIGN KEY (account_type_id) REFERENCES account_types
);


CREATE TABLE IF NOT EXISTS user_photos
(
    id         SERIAL PRIMARY KEY,
    user_id    INT REFERENCES users,
    name       VARCHAR(511),
    is_deleted BOOLEAN DEFAULT FALSE
);


CREATE TABLE IF NOT EXISTS roles
(
    id         BIGSERIAL PRIMARY KEY,
    name       varchar(100) NOT NULL,
    is_deleted BOOL DEFAULT false
);
CREATE TABLE IF NOT EXISTS user_roles
(
    id         BIGSERIAL PRIMARY KEY,
    role_id    BIGINT NOT NULL,
    user_id    BIGINT NOT NULL,
    is_deleted BOOL DEFAULT false,
    FOREIGN KEY (role_id) REFERENCES roles,
    FOREIGN KEY (user_id) REFERENCES users
);
CREATE TABLE IF NOT EXISTS resources
(
    id         BIGSERIAL PRIMARY KEY,
    url        varchar(255) NOT NULL,
    method     varchar(50)  NOT NULL,
    is_deleted BOOL DEFAULT false
);
CREATE TABLE IF NOT EXISTS accesses
(
    id          BIGSERIAL PRIMARY KEY,
    resource_id BIGINT NOT NULL,
    role_id     BIGINT NOT NULL,
    is_deleted  BOOL DEFAULT false,
    FOREIGN KEY (role_id) REFERENCES roles,
    FOREIGN KEY (resource_id) REFERENCES resources
);

CREATE TABLE IF NOT EXISTS sms_data
(
    code          SERIAL PRIMARY KEY,
    creation_date TIMESTAMP DEFAULT NOW(),
    accepted      BOOLEAN   DEFAULT FALSE
);


create table IF NOT EXISTS activation_codes
(
    id              bigserial primary key,
    user_id         bigint not null,
    token           varchar(8),
    number_of_tries int     default 0,
    created_at      varchar(100),
    is_deleted      boolean default false
);

CREATE TABLE IF NOT EXISTS forget_password_tokens
(
    id           BIGSERIAL PRIMARY KEY,
    token        VARCHAR(12),
    user_id      BIGINT,
    is_deleted   BOOLEAN   DEFAULT FALSE,
    requested_at TIMESTAMP DEFAULT NOW(),
    is_active    BOOLEAN   DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users
);

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

CREATE TABLE IF NOT EXISTS project_people
(
    id            SERIAL PRIMARY KEY,
    user_id      INT,
    project_id   INT,
    is_deleted   BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users,
    FOREIGN KEY (project_id) REFERENCES projects
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

CREATE TABLE IF NOT EXISTS incidents
(
    id               SERIAL PRIMARY KEY,
    zone_id          INT NOT NULL,
    user_id          BIGINT NOT NULL ,
    type             VARCHAR(127)  NOT NULL,
    financial_damage INT DEFAULT 0 NOT NULL,
    human_damage     INT DEFAULT 0 NOT NULL,
    date             TIMESTAMP          NOT NULL,
    description      VARCHAR(2047) NOT NULL,
    reason           VARCHAR(255)  NOT NULL,
    previous_version INT DEFAULT NULL,
    FOREIGN KEY (zone_id) REFERENCES zones,
    FOREIGN KEY (user_id) REFERENCES users,
    FOREIGN KEY (previous_version) REFERENCES incidents
);

CREATE TABLE IF NOT EXISTS incident_images
(
    id         BIGSERIAL PRIMARY KEY,
    incident_id  BIGINT       DEFAULT NULL,
    path       varchar(250) NOT NULL,
    FOREIGN KEY (incident_id) REFERENCES incidents (id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS incident_voices
(
    id         BIGSERIAL PRIMARY KEY,
    incident_id  BIGINT       DEFAULT NULL,
    path       varchar(250) NOT NULL,
    FOREIGN KEY (incident_id) REFERENCES incidents (id)
        ON DELETE CASCADE
);

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

CREATE TABLE IF NOT EXISTS reports
(
    id          SERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    zone_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    creation_date  VARCHAR(28) NOT NULL,
    correctness_percent FLOAT DEFAULT Null,
    parent_id BIGINT DEFAULT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (activity_id) REFERENCES activities,
    FOREIGN KEY (zone_id) REFERENCES zones,
    FOREIGN KEY (user_id) REFERENCES users,
    FOREIGN KEY (parent_id) REFERENCES reports ON DELETE SET NULL
);


CREATE TABLE iF NOT EXISTS sessions
(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    token VARCHAR(32),
    uuid UUID,

    FOREIGN KEY (user_id) REFERENCES users
);

CREATE TABLE IF NOT EXISTS categories
(
    id        SERIAL PRIMARY KEY,
    name      varchar(100) NOT NULL,
    parent_id INT DEFAULT NULL,
    FOREIGN KEY (parent_id) REFERENCES categories (id)
);

CREATE TABLE IF NOT EXISTS questions
(
    id                  SERIAL PRIMARY KEY,
    list_order          INT DEFAULT 0,
    title               TEXT NOT NULL,
    paragraph           TEXT DEFAULT NULL,
    category_id         INT  NOT NULL,
    is_base             BOOLEAN      DEFAULT TRUE,
    has_correct_choice  BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (category_id) REFERENCES categories (id)
);


CREATE TABLE IF NOT EXISTS options
(
    id                SERIAL PRIMARY KEY,
    option            TEXT NOT NULL,
    question_id       INT  NOT NULL,
    is_correct_choice BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES questions (id)
);

CREATE TABLE IF NOT EXISTS answers(
    id BIGSERIAL PRIMARY KEY,
    description TEXT DEFAULT NULL,
    question_id BIGINT NOT NULL,
    option_id BIGINT NOT NULL,
    report_id BIGINT NOT NULL,
    is_deleted BOOL DEFAULT FALSE,
    FOREIGN KEY (option_id) REFERENCES options,
    FOREIGN KEY (question_id) REFERENCES questions,
    FOREIGN KEY (report_id) REFERENCES reports
);

CREATE TABLE IF NOT EXISTS links
(
    id          SERIAL PRIMARY KEY,
    option_id   INT NOT NULL,
    question_id INT NOT NULL,
    FOREIGN KEY (option_id) REFERENCES options (id),
    FOREIGN KEY (question_id) REFERENCES questions (id)
);

CREATE TABLE IF NOT EXISTS question_images
(
    id          SERIAL PRIMARY KEY,
    question_id INT          NOT NULL,
    path        varchar(250) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions (id)
);

CREATE TABLE IF NOT EXISTS answer_images
(
    id         BIGSERIAL PRIMARY KEY,
    answer_id  BIGINT       DEFAULT NULL,
    path       varchar(250) NOT NULL,
    FOREIGN KEY (answer_id) REFERENCES answers (id)
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS answer_voices
(
    id         BIGSERIAL PRIMARY KEY,
    answer_id  BIGINT       DEFAULT NULL,
    path       varchar(250) NOT NULL,
    FOREIGN KEY (answer_id) REFERENCES answers (id)
        ON DELETE CASCADE
);

INSERT INTO account_types (id, name, price) values (1, 'default', 100)
ON CONFLICT (id) DO UPDATE SET name = 'default', price = 100;
INSERT INTO categories(id, name, parent_id) VALUES (1,'test',null);

INSERT INTO roles (id, name)
VALUES  (1, 'admin'),
        (2, 'project manager'),
        (3, 'refree')
        ;

-- USER MANAGEMENTS
INSERT INTO resources(id, url, method)
VALUES (101, '/api/users', 'post'),
       (102, '/api/users', 'get'),
       (103, '/api/users/:id', 'get'),
       (104, '/api/users/:id', 'put'),
       (105, '/api/users/:id', 'delete');
INSERT INTO accesses (resource_id, role_id)
VALUES (101, 1),
       (102, 1),
       (103, 1),
       (104, 1),
       (105, 1),
       (101, 2),
       (102, 2),
       (103, 2),
       (104, 2),
       (105, 2),
       (102, 3),
       (103, 3),
       (104, 3),
       (105, 3);

-- PROJECTS
INSERT INTO resources(id, url, method)
VALUES (201, '/api/projects', 'post'),
       (202, '/api/projects', 'get'),
       (203, '/api/projects/:id', 'get'),
       (204, '/api/projects/:id', 'put'),
       (205, '/api/projects/:id', 'delete'),
       (206, '/api/projects/people/:id', 'post'),
       (207, '/api/projects/people/:id', 'get'),
       (208, '/api/projects/people/:id', 'delete');

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
       (206, 2),
       (207, 1),
       (207, 2),
       (208, 2),
       (208, 1),
       (202, 3),
       (203, 3),
       (207, 3);

-- REPORTS (30x)
INSERT INTO resources(id, url, method)
VALUES (301, '/api/reports', 'post'),
       (302, '/api/reports', 'get'),
       (303, '/api/reports/:id', 'get'),
       (304, '/api/reports/files', 'post'),
       (305, '/api/reports/:id', 'put');

INSERT INTO accesses (resource_id, role_id)
VALUES (301, 1),
       (302, 1),
       (303, 1),
       (304, 1),
       (305, 1),
       (301, 2),
       (302, 2),
       (303, 2),
       (304, 2),
       (305, 2),
       (301, 3),
       (302, 3),
       (303, 3),
       (304, 3),
       (305, 3)
       ;
-- ACTIVITIES (40x)
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
       (405, 2),
       (402, 3),
       (403, 3);

-- CATEGORIES (50x)
INSERT INTO resources(id, url, method)
VALUES (501, '/api/categories', 'post'),
       (502, '/api/categories', 'get');

INSERT INTO accesses (resource_id, role_id)
VALUES  (501, 1),
        (502, 1),
        (502, 2),
        (502, 3);


-- QUESTIONS (60x)
INSERT INTO resources(id, url, method)
VALUES (601, '/api/questions', 'post'),
       (602,'/api/questions', 'get'),
       (603, '/api/questions/:id/images', 'post'),
       (604, '/api/questions/order/:category_id', 'get'),
       (605 ,'/api/questions/:id', 'put'),
       (606, '/api/questions/:id', 'delete'),
       (607, '/api/questions/:id', 'get');

INSERT INTO accesses (resource_id, role_id)
VALUES (601, 1),
       (602, 1),
       (602, 2),
       (603, 1),
       (604, 1),
       (604, 2),
       (605, 1),
       (606, 1),
       (607, 1),
       (607, 2);

-- SUBSCRIPTIONS (70x)
INSERT INTO resources (id, url, method)
VALUES  (701, '/api/subscription', 'post'),
        (702, '/api/subscription/buy', 'post'),
        (703, '/api/subscription/verify', 'post'),
        (704, '/api/subscription/type/:id', 'put'),
        (705, '/api/subscription/type/:id', 'get'),
        (706, '/api/subscription/type', 'get'),
        (707, '/api/subscription/type/:id', 'delete')
        ;

INSERT INTO accesses (resource_id, role_id)
VALUES  (701, 1),
        (701, 2),
        (701, 3),
        (702, 1),
        (702, 2),
        (702, 3),
        (703, 1),
        (703, 2),
        (703, 3),
        (704, 1),
        (705, 1),
        (705, 2),
        (705, 3),
        (706, 1),
        (706, 2),
        (706, 3),
        (707, 1)
        ;
-- ZONES (80x)
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
       (805, 2),
       (803, 3),
       (802, 3);


-- INCIDENTS (90x)
INSERT INTO resources (id, url, method)
VALUES (901, '/api/incidents', 'post'),
       (902, '/api/incidents/list/:project_id', 'get'),
       (903, '/api/incidents/fetch/:incident_id', 'get'),
       (904, '/api/incidents/:incident_id', 'put'),
       (905, '/api/incidents/files', 'post');

INSERT INTO accesses(resource_id, role_id)
VALUES (901, 1),
       (902, 1),
       (903, 1),
       (904, 1),
       (901, 2),
       (902, 2),
       (903, 2),
       (904, 2),
       (901, 3),
       (902, 3),
       (903, 3),
       (904, 3),
       (905, 1),
       (905, 2),
       (905, 3);




