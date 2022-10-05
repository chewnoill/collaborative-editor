-- migrate:up
DROP FUNCTION create_user;

CREATE FUNCTION create_user(name text, password text)
RETURNS users
AS $$
  INSERT INTO users
    (name, password)
    VALUES (name, crypt(password, gen_salt('bf')))
    RETURNING *;
$$ LANGUAGE sql VOLATILE STRICT;

-- migrate:down

