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
    phone_number    VARCHAR(15) UNIQUE NOT NULL,
    first_name      VARCHAR(63)        NOT NULL,
    last_name       VARCHAR(63)        NOT NULL,
    password   VARCHAR(511)       NOT NULL,
    account_type_id INT     DEFAULT NULL,
    is_verified     BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    is_deleted      BOOLEAN DEFAULT FALSE,
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
    star_date          DATE,
    scheduled_end_date DATE,
    person_id          INT,
    status             VARCHAR(255),
    FOREIGN KEY (person_id) REFERENCES users
);

CREATE TABLE IF NOT EXISTS reports
(
    id          SERIAL PRIMARY KEY,
    activity_id INT,
    -- TODO add report details
    FOREIGN KEY (activity_id) REFERENCES activities
);
