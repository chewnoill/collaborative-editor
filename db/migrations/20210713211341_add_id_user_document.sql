-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

ALTER TABLE user_document
ADD id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY;

-- migrate:down
ALTER TABLE user_document
DROP COLUMN id;
DROP EXTENSION "uuid-ossp"
