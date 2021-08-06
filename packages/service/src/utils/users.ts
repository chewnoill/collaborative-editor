import { db, pool, schema } from "../db";

export function createUser(props: { username: string; password: string }) {
  return db
    .insert("users", {
      name: props.username,
      password: db.sql`crypt(${db.param(props.password)}, gen_salt('md5'))`,
    })
    .run(pool);
}

export async function validateUser(props: { name: string; password: string }) {
  const user = db.sql<
    schema.users.SQL,
    schema.users.Selectable
  >`SELECT ${"password"}, ${"id"}, ${"name"} FROM ${"users"} WHERE ${{
    name: props.name,
    password: db.sql`${"password"} = crypt(${db.param(
      props.password
    )}, ${"password"})`,
  }}`.run(pool);
  return (await user)[0];
}

export const selectUsers = () => {
  const users = db.sql<
    schema.users.SQL,
    schema.users.Selectable[]
  >`SELECT * FROM ${"users"}`.run(pool);
  return users;
};

export const updatePassword = (props: {
  password: string;
  new_password: string;
  username: string;
}) => {
  db.sql`UPDATE ${"users"} SET ${"password"} = crypt(${db.param(
    props.new_password
  )}, gen_salt('md5')) WHERE ${{
    name: props.username,
    password: db.sql`${"password"} = crypt(${db.param(
      props.password
    )}, ${"password"})`,
  }};`.run(pool);
};
