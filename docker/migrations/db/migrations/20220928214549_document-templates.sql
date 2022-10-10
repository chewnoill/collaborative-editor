-- migrate:up

CREATE TABLE app.document_templates (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  user_id uuid,
  content text,
  created_at timestamp DEFAULT now() NOT NULL,
  FOREIGN KEY (user_id) REFERENCES app.user(id) ON DELETE CASCADE
);

ALTER TABLE app.document_templates ENABLE ROW LEVEL SECURITY;
GRANT ALL on app.document_templates TO postgraphile_user;

comment on table app.document_templates is '
@name document_templates
';

CREATE POLICY document_templates_if_allowed ON app.document_templates
  FOR ALL
  TO postgraphile_user
  USING (
    user_id is NULL
    OR user_id = current_user_id()
  )
  WITH CHECK (
    user_id = current_user_id()
  );

-- migrate:down

DROP TABLE app.document_templates CASCADE;