-- migrate:up
ALTER TABLE data_upload ENABLE ROW LEVEL SECURITY;
GRANT SELECT,INSERT,DELETE on data_upload TO postgraphile_user;
CREATE POLICY access_data_uploads ON data_upload
  FOR ALL
  TO postgraphile_user
  USING (
    data_upload.owner_id = current_user_id()
  )
  WITH CHECK (
    data_upload.owner_id = current_user_id()
  );


-- migrate:down
ALTER TABLE data_upload DISABLE ROW LEVEL SECURITY;
REVOKE SELECT,INSERT,DELETE on data_upload FROM postgraphile_user;
DROP POLICY access_data_uploads ON data_upload;
