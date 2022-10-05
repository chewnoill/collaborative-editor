-- migrate:up
ALTER TABLE document_updates_queue ADD user_id uuid;
ALTER TABLE document_updates_queue
ADD FOREIGN KEY (user_id) REFERENCES users(id);

-- migrate:down
ALTER TABLE document_updates_queue DROP user_id;