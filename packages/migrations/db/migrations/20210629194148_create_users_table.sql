-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE document ( 
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  origin text NOT NULL,
  value text NOT NULL,
  web_rtc_key text NOT NULL
);

CREATE TABLE user_document (
  document_id uuid,
  user_id uuid,

  FOREIGN KEY (document_id) REFERENCES document(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (document_id, user_id)
);
-- migrate:down
DROP TABLE user_document;
DROP TABLE users;
DROP TABLE document;
DROP EXTENSION "uuid-ossp";
