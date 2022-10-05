-- migrate:up
comment on column users.password is '
@name password
@omit';

-- migrate:down

