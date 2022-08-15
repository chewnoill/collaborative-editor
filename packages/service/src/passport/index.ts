import passport from "passport";
import localStrategy from "./local-strategy";
import TokenStrategy from "./access-token";
import AnonymousStrategy from "passport-anonymous";

passport.use(localStrategy);
passport.use(TokenStrategy);
passport.use(new AnonymousStrategy());

passport.serializeUser(function (user, done) {
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function (data, done) {
  const user = JSON.parse(data);
  done(null, user);
});

export default passport;
