-- migrate:up
CREATE UNIQUE INDEX unique_user_name ON users (name);
ALTER TABLE users ADD CONSTRAINT unique_user_name UNIQUE USING INDEX unique_user_name;

-- migrate:down

