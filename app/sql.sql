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
    zone_id          INT,
    type             VARCHAR(127)  NOT NULL,
    financial_damage INT DEFAULT 0 NOT NULL,
    human_damage     INT DEFAULT 0 NOT NULL,
    date             DATE          NOT NULL,
    description      VARCHAR(2047) NOT NULL,
    hour             INT           NOT NULL,
    reason           VARCHAR(255)  NOT NULL,
    FOREIGN KEY (zone_id) REFERENCES zones
);

CREATE TABLE IF NOT EXISTS incident_photos
(
    id          SERIAL PRIMARY KEY,
    incident_id INT,
    name        VARCHAR(511),
    FOREIGN KEY (incident_id) REFERENCES incidents
);

CREATE TABLE IF NOT EXISTS activities
(
    id                 SERIAL PRIMARY KEY,
    start_date          DATE,
    scheduled_end_date DATE,
    person_id          INT,
    status             VARCHAR(255),
    FOREIGN KEY (person_id) REFERENCES users
);

CREATE TABLE IF NOT EXISTS reports
(
    id          SERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    zone_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    creation_date  DATE NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (activity_id) REFERENCES activities,
    FOREIGN KEY (zone_id) REFERENCES zones,
    FOREIGN KEY (user_id) REFERENCES users
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

CREATE TABLE IF NOT EXISTS definitions
(
    id          SERIAL PRIMARY KEY,
    question_id INT          NOT NULL,
    title       varchar(250) NOT NULL,
    text        TEXT         NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions (id)
);

CREATE TABLE IF NOT EXISTS answer_images
(
    id         BIGSERIAL PRIMARY KEY,
    answer_id  BIGINT       NOT NULL,
    path       varchar(250) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (answer_id) REFERENCES answers (id)
);

CREATE TABLE IF NOT EXISTS answer_voices
(
    id         BIGSERIAL PRIMARY KEY,
    answer_id  BIGINT       NOT NULL,
    path       varchar(250) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (answer_id) REFERENCES answers (id)
);

INSERT INTO account_types (id, name, price) values (1, 'default', 100)
ON CONFLICT (id) DO UPDATE SET name = 'default', price = 100;

INSERT INTO categories(id, name, parent_id) VALUES (1,'test',null);

INSERT INTO roles (id, name)
VALUES  (1, 'admin'),
        (2, 'project manager'),
        (3, 'refree')
        ;
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

