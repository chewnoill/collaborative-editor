-- migrate:up
ALTER TABLE document ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_document ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION current_user_id() RETURNS uuid AS $$
  SELECT nullif(current_setting('app.user_id', true), '')::uuid;
$$ LANGUAGE SQL STABLE;

CREATE ROLE postgraphile_user;
GRANT SELECT on document TO postgraphile_user;
GRANT SELECT on user_document TO postgraphile_user;

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

-- migrate:down
DROP POLICY select_document_if_allowed ON document;
REVOKE SELECT ON document FROM postgraphile_user;
REVOKE SELECT ON user_document FROM postgraphile_user;

DROP ROLE postgraphile_user;
DROP FUNCTION current_user_id;

ALTER TABLE document DISABLE ROW LEVEL SECURITY;
