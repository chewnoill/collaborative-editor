-- migrate:up
GRANT SELECT on document_history TO postgraphile_user;

-- migrate:down
REVOKE SELECT on document_history FROM postgraphile_user;

