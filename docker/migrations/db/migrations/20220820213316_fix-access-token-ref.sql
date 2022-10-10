-- migrate:up
DELETE from app.access_token;

ALTER TABLE app.access_token
    DROP CONSTRAINT access_token_user_id_fkey;
ALTER TABLE app.access_token
    ADD FOREIGN KEY (user_id) REFERENCES app.user(id) ON DELETE CASCADE;

-- migrate:down

