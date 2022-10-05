-- migrate:up
DELETE from document; 
ALTER TABLE document ADD creator_id uuid NOT NULL;
ALTER TABLE document
ADD FOREIGN KEY (creator_id) REFERENCES users(id);

-- migrate:down
ALTER TABLE document DROP creator_id;

