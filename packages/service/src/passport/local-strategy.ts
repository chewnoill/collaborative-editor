import { validateUser } from "../utils/users";
import LocalStrategy from "passport-local";
import logger from "../logger";

const log = (props: { level; message; body }) =>
  logger({
    service: "passport-local-strategy",
    ...props,
  });

export default new LocalStrategy(async function (username, password, done) {
  try {
    const user = await validateUser({ name: username, password: password });
    if (!user) {
      log({
        level: "warn",
        message: `login failed - ${username}`,
        body: {
          user_id: user.id,
        },
      });
      return done(null, null);
    }
    log({
      level: "info",
      message: `user logged in ${user.name}`,
      body: {
        user_id: user.id,
      },
    });
    return done(null, user);
  } catch (e) {
    return done("invalid user");
  }
});
