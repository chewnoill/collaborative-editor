-- migrate:up
ALTER TABLE document ADD name text DEFAULT '' NOT NULL;

-- migrate:down
ALTER TABLE document DROP name;
