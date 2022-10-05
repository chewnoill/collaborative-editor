-- migrate:up
GRANT SELECT,INSERT,DELETE on document_updates_queue TO postgraphile_user;
CREATE POLICY document_updates_queue_if_allowed ON document_updates_queue
  FOR ALL
  TO postgraphile_user
  USING (
    document_id IN (
        select id
        from document
        where document.id = document_id
    )
  )
  WITH CHECK (
    document_id IN (
        select id
        from document
        where document.id = document_id
    )
  );

-- migrate:down

REVOKE ALL on document_updates_queue FROM postgraphile_user;
DROP POLICY document_updates_queue_if_allowed ON document_updates_queue