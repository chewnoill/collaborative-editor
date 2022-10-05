-- migrate:up
GRANT UPDATE on document TO postgraphile_user;
CREATE POLICY all_for_owner ON document
  FOR ALL
  TO postgraphile_user
  USING (
    document.creator_id = current_user_id() 
  )
  WITH CHECK (
    document.creator_id  = current_user_id()
  );


-- migrate:down
REVOKE UPDATE on document FROM postgraphile_user;
DROP POLICY all_for_owner ON document

