-- migrate:up
ALTER TABLE app.document_updates_queue
ADD structs jsonb;

-- migrate:down
ALTER TABLE app.document_updates_queue
DROP structs;

