-- migrate:up
ALTER TABLE document ADD latest_update_time timestamp NOT NULL;
-- migrate:down
ALTER TABLE document DROP COLUMN latest_update_time;
