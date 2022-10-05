-- migrate:up

CREATE TABLE app.document_tags (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  document_id uuid NOT NULL,
  tag text NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  UNIQUE (document_id, tag),
  FOREIGN KEY (document_id) REFERENCES app.document(id) ON DELETE CASCADE
);

ALTER TABLE app.document_tags ENABLE ROW LEVEL SECURITY;
GRANT SELECT on app.document_tags TO postgraphile_user;

comment on table app.document_tags is '
@name document_tags
@omit create,update,delete

# Document Tags

Tags associated with each document.

';

CREATE POLICY document_tags_if_allowed ON app.document_tags
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


-- migrate:down

DROP TABLE app.document_tags CASCADE;