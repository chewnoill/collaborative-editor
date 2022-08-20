import { db, pool, schema } from "../db";

export function createUser(props: { username: string; password: string }) {
  return db
    .insert("app.user", {
      name: props.username,
      password: db.sql`crypt(${db.param(props.password)}, gen_salt('md5'))`,
    })
    .run(pool);
}

export async function validateUser(props: { name: string; password: string }) {
  const user = db.sql<
    schema.app.user.SQL,
    schema.app.user.Selectable
  >`SELECT ${"password"}, ${"id"}, ${"name"} FROM ${"app.user"} WHERE ${{
    name: props.name,
    password: db.sql`${"password"} = crypt(${db.param(
      props.password
    )}, ${"password"})`,
  }}`.run(pool);
  return (await user)[0];
}

export const selectUsers = () => {
  const users = db.sql<
    schema.app.user.SQL,
    schema.app.user.Selectable[]
  >`SELECT * FROM ${"app.user"}`.run(pool);
  return users;
};

export const updatePassword = (props: {
  password: string;
  new_password: string;
  username: string;
}) => {
  return db.sql`UPDATE ${"app.user"} SET ${"password"} = crypt(${db.param(
    props.new_password
  )}, gen_salt('md5')) WHERE ${{
    name: props.username,
    password: db.sql`${"password"} = crypt(${db.param(
      props.password
    )}, ${"password"})`,
  }};`.run(pool);
};
