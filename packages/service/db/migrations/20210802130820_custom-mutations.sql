-- migrate:up

comment on table schema_migrations is '
@name schema_migrations
@omit';
comment on table user_document is '
@name user_document
@omit create,update,delete';
comment on table document_updates_queue is '
@name document_updates_queue
@omit';
comment on table users is '
@name users
@omit create,update,delete';
comment on table document is '
@name document
@omit create,update,delete';
comment on column document.latest_update_time is '
@name latest_update_time
@omit create,update';


CREATE FUNCTION create_user(name text)
RETURNS users
AS $$
  INSERT INTO users
    (name)
    VALUES (name)
    RETURNING *;
$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION create_document(value text, origin bytea)
RETURNS document
AS $$
  INSERT INTO document
    (creator_id, value, origin)
    VALUES (current_user_id(), value, origin)
    RETURNING *;
$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION invite_user_to_document(name text, document_id uuid)
RETURNS user_document
AS $$
  INSERT INTO user_document
    (user_id, document_id)
    VALUES ((SELECT users.id FROM users where name=name), document_id)
    RETURNING *;
$$ LANGUAGE sql VOLATILE STRICT;



-- migrate:down

DROP FUNCTION create_user;
DROP FUNCTION create_document;
DROP FUNCTION invite_user_to_document;

