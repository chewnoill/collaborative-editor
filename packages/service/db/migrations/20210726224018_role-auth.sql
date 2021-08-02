-- migrate:up
ALTER TABLE document ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_document ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION current_user_id() RETURNS uuid AS $$
  SELECT nullif(current_setting('app.user_id', true), '')::uuid;
$$ LANGUAGE SQL STABLE;

CREATE FUNCTION me() RETURNS users AS $$
  SELECT * FROM users WHERE id = current_user_id()
$$ LANGUAGE SQL STABLE;

CREATE ROLE postgraphile_user;
GRANT SELECT,INSERT on users TO postgraphile_user;
GRANT SELECT,INSERT on document TO postgraphile_user;
GRANT SELECT,INSERT,DELETE on user_document TO postgraphile_user;

CREATE POLICY select_document_if_allowed ON document
  FOR SELECT
  TO postgraphile_user
  USING (
    document.creator_id = current_user_id() 
    OR document.id IN (
      SELECT user_document.document_id FROM user_document 
        WHERE user_document.user_id = current_user_id()
    )
  );

CREATE POLICY invite_to_document_if_allowed ON user_document
  FOR INSERT
  TO postgraphile_user
  WITH CHECK (
    user_document.document_id IN (
      SELECT document.id FROM document 
        WHERE document.creator_id = current_user_id()
    )
  );

CREATE POLICY create_document_for_current_user ON document
  FOR INSERT
  TO postgraphile_user
  WITH CHECK (
    document.creator_id = current_user_id() 
  );

-- migrate:down
DROP POLICY create_document_for_current_user ON document;
DROP POLICY select_document_if_allowed ON document;
DROP POLICY invite_to_document_if_allowed on user_document;
REVOKE INSERT,SELECT ON users FROM postgraphile_user;
REVOKE SELECT,INSERT ON document FROM postgraphile_user;
REVOKE SELECT,INSERT,DELETE ON user_document FROM postgraphile_user;

DROP ROLE postgraphile_user;
DROP FUNCTION me;
DROP FUNCTION current_user_id;

ALTER TABLE document DISABLE ROW LEVEL SECURITY;
