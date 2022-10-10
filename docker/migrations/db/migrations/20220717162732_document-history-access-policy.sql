-- migrate:up
ALTER TABLE document_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY select_document_history_if_allowed ON document_history
  FOR SELECT
  TO postgraphile_user
  USING (
    document_id IN (
        select id
        from document
        where document.id = document_id
    )
  );

COMMENT ON TABLE document_history IS '
@name document history
@omit create,update,delete';

-- migrate:down

ALTER TABLE document_history DISABLE ROW LEVEL SECURITY;
drop policy select_document_history_if_allowed ON document_history;

