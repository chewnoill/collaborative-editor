import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import bodyParser from "body-parser";
import { validateUser } from "./utils/users";
import { gqlMiddleware } from "./db";
import Session from "./session";
import expressWs from "express-ws";
import path from "path";

const SESSION_SECRET = process.env.SESSION_SECRET || "big secret";

const app = express();

app.use(function (req, _res, next) {
  if (req.url.startsWith("/document/")) {
    req.url = "/document/[id]/";
  }
  next();
});

const STATIC_PATH = path.resolve(__dirname, "../../client/out");

app.use("/", express.static(STATIC_PATH));
expressWs(app);

app.use(Session);

const auth = (req, resp, next) => {
  if (!req.user) {
    resp.status(401);
    next(new Error("need to login"));
  } else {
    next();
  }
};

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try{
      const user = await validateUser({ name: username, password: password });
      if (!user) {
        return done("invalid user");
      }
      return done(null, { username: user.name, id: user.id });
    } catch(e) {
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(gqlMiddleware());

app.get("/health-check", (_, resp) => {
  resp.send("OK");
});

app.post(
  "/api/login",
  passport.authenticate("local", { successRedirect: "/", session: true })
);

export default app;
