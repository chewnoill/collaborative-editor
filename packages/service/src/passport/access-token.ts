import { db, pool, schema } from "../db";
import { Strategy as TokenStrategy } from "passport-accesstoken";
import logger from "../logger";

const strategyOptions = {
  tokenHeader: "auth-token",
  tokenField: "auth-token",
};

const log = (props: { level; message; body }) =>
  logger({
    service: "passport-access-token-strategy",
    ...props,
  });

export default new TokenStrategy(strategyOptions, async function (token, done) {
  try {
    const accessToken = await db
      .selectOne(
        "access_token",
        {
          id: token,
        },
        {
          lateral: {
            user: db.selectExactlyOne("users", {
              id: db.parent("user_id"),
            }),
          },
        }
      )
      .run(pool);
    if ("user" in accessToken) {
      const user: schema.users.Selectable = (accessToken as any).user;
      log({
        level: "info",
        message: `user logged in ${user.name}`,
        body: {
          id: user.id,
        },
      });
      return done(null, (accessToken as any).user);
    } else {
      log({
        level: "warn",
        message: `token auth failed!`,
        body: {},
      });
      return done(null);
    }
  } catch (error) {
    logger({ level: "error", service: "access_token", error });
    return done(null);
  }
});
