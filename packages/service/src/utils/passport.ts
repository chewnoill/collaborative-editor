import { validateUser } from "./users";
import passport from "passport";
import LocalStrategy from "passport-local";

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await validateUser({ name: username, password: password });
      if (!user) {
        return done(null,null);
      }
      return done(null, { username: user.name, id: user.id });
    } catch (e) {
      return done("invalid user");
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function (data, done) {
  const user = JSON.parse(data);
  done(null, user);
});

export default passport;
