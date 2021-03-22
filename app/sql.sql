CREATE TABLE IF NOT EXISTS roles(
    id BIGSERIAL PRIMARY KEY,
    name varchar(100) NOT NULL,
    is_deleted BOOL DEFAULT false
);
CREATE TABLE IF NOT EXISTS user_roles(
    id BIGSERIAL PRIMARY KEY,
    role_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    is_deleted BOOL DEFAULT false
);
CREATE TABLE IF NOT EXISTS resources(
    id BIGSERIAL PRIMARY KEY,
    url varchar(50) NOT NULL,
    method varchar(50) NOT NULL,
    is_deleted BOOL DEFAULT false
);
CREATE TABLE IF NOT EXISTS accesses(
    id BIGSERIAL PRIMARY KEY,
    resource_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    is_deleted BOOL DEFAULT false
);
CREATE TABLE IF NOT EXISTS users(
    id BIGSERIAL PRIMARY KEY,
    username varchar(50) NOT NULL,
    password varchar(191) NOT NULL,
    first_name varchar(50),
    last_name varchar(50),
    is_active BOOL DEFAULT TRUE,
    is_deleted BOOL DEFAULT FALSE
);

create table forget_password_tokens
(
    id           bigserial not null
            primary key,
    token        varchar(6),
    user_id      bigint,
    is_deleted   boolean default false,
    requested_at bigint,
    is_active    boolean default false
);
