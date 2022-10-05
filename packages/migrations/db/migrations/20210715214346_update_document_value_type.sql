-- migrate:up
ALTER TABLE document DROP COLUMN origin;
ALTER TABLE document ADD origin bytea NOT NULL;
-- migrate:down
ALTER TABLE document DROP COLUMN origin;
ALTER TABLE document ADD origin text NOT NULL;
