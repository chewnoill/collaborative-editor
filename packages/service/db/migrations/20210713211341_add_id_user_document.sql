-- migrate:up
ALTER TABLE user_document
ADD id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY;
-- migrate:down
ALTER TABLE user_document
DROP COLUMN id;
