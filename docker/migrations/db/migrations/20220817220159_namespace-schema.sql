-- migrate:up

CREATE SCHEMA app;

/* table definitions */

CREATE TABLE app.user (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  name text NOT NULL,
  password text,

  UNIQUE(name)
);

comment on table app.user is '
@name user
@omit create,update,delete

User Table

The base entity for the application.';

comment on column app.user.password is '
@name password
@omit

Password

hashed, still sensitive, do not expose to GQL
';

CREATE TABLE app.document (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  creator_id uuid NOT NULL,
  is_public boolean default false,
  name text DEFAULT '' NOT NULL,
  origin bytea NOT NULL,
  value text NOT NULL,
  web_rtc_key text NOT NULL,
  latest_update_time timestamp NOT NULL,

  FOREIGN KEY (creator_id) REFERENCES app.user(id) ON DELETE CASCADE
);

comment on table app.document is '
@name document
@omit create,update,delete

# Documents

The source of truth for all documents in the system.

';

comment on column app.document.latest_update_time is '
@name latest_update_time
@omit create,update

# Last Update Time

Updates are processed through the document_updates_queue table first.
This records time of the last update processed.

TODO: this should be a foreign key that points directly to a row in
the document_updates_queue table.

';

CREATE POLICY create_document_for_current_user ON app.document
  FOR INSERT
  TO postgraphile_user
  WITH CHECK (
    document.creator_id = current_user_id()
  );

CREATE TABLE app.user_document (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  document_id uuid,
  user_id uuid,

  FOREIGN KEY (document_id) REFERENCES app.document(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES app.user(id) ON DELETE CASCADE,
  UNIQUE (document_id, user_id)
);

comment on table app.user_document is '
@name user_document
@omit create,update,delete

# User Documents

Manages access control relationship to documents for users

';

CREATE POLICY select_document_if_allowed ON app.document
  FOR SELECT
  TO postgraphile_user
  USING (
    document.creator_id = current_user_id()
    OR document.is_public = TRUE
    OR document.id IN (
      SELECT user_document.document_id FROM app.user_document
        WHERE user_document.user_id = current_user_id()
    )
  );


CREATE POLICY invite_to_document_if_allowed ON app.user_document
  FOR INSERT
  TO postgraphile_user
  WITH CHECK (
    user_document.document_id IN (
      SELECT document.id FROM app.document
        WHERE document.creator_id = current_user_id()
    )
  );


CREATE TABLE app.document_updates_queue (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  user_id uuid,
  document_id uuid NOT NULL,
  document_update bytea NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  FOREIGN KEY (user_id) REFERENCES app.user(id) ON DELETE CASCADE,
  FOREIGN KEY (document_id) REFERENCES app.document(id) ON DELETE CASCADE
);

comment on table app.document_updates_queue is '
@name document_updates_queue
@omit

# Document Update Queue

Updates to the main document CRDT are persisted here first,
and are eventually processed into the main Document table.

Is not exposed through GQL endpoints.

';

CREATE POLICY document_updates_queue_if_allowed ON app.document_updates_queue
  FOR ALL
  TO postgraphile_user
  USING (
    document_id IN (
        select id
        from app.document
        where document.id = document_id
    )
  )
  WITH CHECK (
    document_id IN (
        select id
        from app.document
        where document.id = document_id
    )
  );

CREATE TABLE app.data_upload (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    file_name text NOT NULL,
    owner_id uuid NOT NULL,
    created_at timestamp DEFAULT now() NOT NULL,
    size integer NOT NULL,
    mime_type text NOT NULL,

    FOREIGN KEY (owner_id) REFERENCES app.user(id) ON DELETE CASCADE
);

comment on table app.data_upload is '
@name data_upload
@omit create,update,delete

Data Uploads

This is a table with external keys to links on
an external system (GCS storage bucket)

';

CREATE POLICY access_data_uploads ON app.data_upload
  FOR ALL
  TO postgraphile_user
  USING (
    data_upload.owner_id = current_user_id()
  )
  WITH CHECK (
    data_upload.owner_id = current_user_id()
  );

CREATE TABLE app.document_history (
  document_id uuid NOT NULL,
  sequence SERIAL,
  diff text,
  PRIMARY KEY(document_id, sequence),
  FOREIGN KEY (document_id) REFERENCES app.document(id) ON DELETE CASCADE
);

comment on table app.document_history is '
@name document_history
@omit create,update,delete

# Document History

';

CREATE POLICY select_document_history_if_allowed ON app.document_history
  FOR SELECT
  TO postgraphile_user
  USING (
    document_id IN (
        select id
        from app.document
        where document.id = document_id
    )
  );

CREATE TABLE app.document_update_document_history (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  document_update_id uuid NOT NULL,
  document_id uuid NOT NULL,
  sequence integer NOT NULL,
  FOREIGN KEY (document_update_id) REFERENCES app.document_updates_queue(id) ON DELETE CASCADE,
  FOREIGN KEY (document_id) REFERENCES app.document(id) ON DELETE CASCADE,
  FOREIGN KEY (document_id, sequence) REFERENCES app.document_history(document_id, sequence) ON DELETE CASCADE
);

comment on table app.document_update_document_history is '
@name document_update_document_history
@omit

join table between Document History and Document Update,
doesnt need to be exposed to gql endpoint.

';


CREATE TABLE app.access_token (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  user_id uuid NOT NULL,
  created_at timestamp default now() NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

COMMENT ON TABLE access_token IS '

Access Tokens

Used to authenticate user on API endpoints. If compromised, these can be revoked.
';

CREATE POLICY access_token_if_allowed ON app.access_token
  FOR ALL
  TO postgraphile_user
  USING (
    access_token.user_id = current_user_id()
  )
  WITH CHECK (
    access_token.user_id = current_user_id()
  );


/*
SQL functions
*/

CREATE OR REPLACE FUNCTION current_user_id() RETURNS uuid AS $$
  SELECT nullif(current_setting('app.user_id', true), '')::uuid;
$$ LANGUAGE SQL STABLE;

comment on function current_user_id is 'current_user_id

Gets the current user_id from the session settings. Calling client
must set this setting to enable row level security.

@omit
';

DROP FUNCTION IF EXISTS app.me;
CREATE OR REPLACE FUNCTION app.me() RETURNS app.user AS $$
  SELECT * FROM app.user WHERE id = current_user_id()
$$ LANGUAGE SQL STABLE;

DROP FUNCTION IF EXISTS app.create_user;
CREATE FUNCTION app.create_user(name text, password text)
RETURNS app.user
AS $$
  INSERT INTO app.user
    (name, password)
    VALUES (name, crypt(password, gen_salt('bf')))
    RETURNING *;
$$ LANGUAGE sql VOLATILE STRICT;

comment on function app.create_user is 'Create User

Creates a user with a given password. A random salt is
generated, and applied for each password when it is first
created.
';

DROP FUNCTION IF EXISTS app.invite_user_to_document;
CREATE FUNCTION app.invite_user_to_document(name text, document_id uuid)
RETURNS app.user_document
AS $$
  INSERT INTO app.user_document
    (user_id, document_id)
    VALUES ((SELECT id FROM app.user where name=name), document_id)
    RETURNING *;
$$ LANGUAGE sql VOLATILE STRICT;


/*
Row Level Security
*/

ALTER TABLE app.document ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.user_document ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.document_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.data_upload ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.access_token ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA app to postgraphile_user;
GRANT SELECT on app.document_history TO postgraphile_user;
GRANT SELECT,INSERT on app.user TO postgraphile_user;
GRANT SELECT,INSERT on app.document TO postgraphile_user;
GRANT SELECT,INSERT,DELETE on app.user_document TO postgraphile_user;
GRANT SELECT,INSERT,DELETE on app.data_upload TO postgraphile_user;
GRANT SELECT,INSERT on app.document_updates_queue TO postgraphile_user;
GRANT SELECT,INSERT,DELETE on app.access_token TO postgraphile_user;

/*
Migrate all data
*/

INSERT INTO app.user
SELECT * FROM public.users;

INSERT INTO app.access_token
SELECT * FROM public.access_token;

INSERT INTO app.document (id, creator_id, is_public, name, origin, value, web_rtc_key, latest_update_time)
SELECT id,creator_id, is_public, name, origin, value, web_rtc_key, latest_update_time from public.document;

INSERT INTO app.user_document (id, document_id, user_id)
SELECT id, document_id, user_id from public.user_document;

INSERT into app.document_updates_queue (id, user_id, document_id, document_update, created_at)
SELECT id, user_id, document_id, document_update, created_at from public.document_updates_queue;

INSERT into app.data_upload (id, file_name, owner_id, created_at, size, mime_type)
SELECT id, file_name, owner_id, created_at, size, mime_type from public.data_upload;

INSERT into app.document_history (document_id, sequence, diff)
SELECT document_id, sequence, diff from public.document_history;

INSERT into app.document_update_document_history
SELECT * from public.document_update_document_history;


-- migrate:down

DROP SCHEMA app CASCADE;