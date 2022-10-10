-- migrate:up
CREATE TABLE access_token (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  user_id uuid NOT NULL,
  created_at timestamp default now() NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
COMMENT ON TABLE access_token IS ' ';

ALTER TABLE access_token ENABLE ROW LEVEL SECURITY;
GRANT SELECT,INSERT,DELETE on access_token TO postgraphile_user;
CREATE POLICY access_token_if_allowed ON access_token
  FOR ALL
  TO postgraphile_user
  USING (
    access_token.user_id = current_user_id()
  )
  WITH CHECK (
    access_token.user_id = current_user_id()
  );


-- migrate:down
DROP TABLE access_token;

