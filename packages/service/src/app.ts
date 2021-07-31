import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "express-session";
import { createUser } from "./utils/users";
import { selectUserDocuments, createDocument } from "./utils/documents";
import * as Y from "yjs";
import { gqlMiddleware } from "./db";

const SESSION_SECRET = process.env.SESSION_SECRET || "big secret";

const app = express();

const auth = (req, resp, next) => {
  if (!req.user) {
    resp.status(401);
    next(new Error("need to login"));
  } else {
    next();
  }
};

passport.use(
  new LocalStrategy(async function (username, _password, done) {
    const user = await createUser({ name: username });
    return done(null, { username: user.name, id: user.id });
  })
);

passport.serializeUser(function (user, done) {
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function (data, done) {
  const user = JSON.parse(data);
  done(null, user);
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: "auto" },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(gqlMiddleware());

app.post("/login", passport.authenticate("local", { successRedirect: "/" }));

app.post("/document", auth, async function (req, resp) {
  const dbDoc = await createDocument({ doc: new Y.Doc(), user: req.user });
  resp.send({
    user: req.user,
    document: dbDoc,
  });
});

app.get("/documents", auth, async function (req, resp) {
  const documents = await selectUserDocuments(req.user);
  resp.send({ user: req.user, documents });
});
app.get("/me", function (req, resp) {
  resp.send({ user: req.user });
});

export default app;
