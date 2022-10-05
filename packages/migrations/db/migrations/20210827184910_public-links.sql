-- migrate:up
ALTER TABLE document ADD is_public boolean NOT NULL default TRUE;

DROP POLICY IF EXISTS select_document_if_allowed ON document;

CREATE POLICY select_document_if_allowed ON document
  FOR SELECT
  TO postgraphile_user
  USING (
    document.creator_id = current_user_id() 
    OR document.is_public = TRUE
    OR document.id IN (
      SELECT user_document.document_id FROM user_document 
        WHERE user_document.user_id = current_user_id()

    )
  );
COMMENT ON TABLE document IS '
@name document
@omit create,update,delete';

-- migrate:down
DROP POLICY IF EXISTS select_document_if_allowed ON document;
ALTER TABLE document DROP is_public;