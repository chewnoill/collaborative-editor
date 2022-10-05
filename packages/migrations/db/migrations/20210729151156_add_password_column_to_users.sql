-- migrate:up
ALTER TABLE users ADD password text DEFAULT '' NOT NULL;
CREATE EXTENSION pgcrypto;

-- migrate:down
ALTER TABLE users DROP password;

