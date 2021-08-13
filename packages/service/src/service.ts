import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "express-session";
import http from "http";
import upgradeWebsockets from "./websocket-service";
import {
  createUser,
  validateUser,
  selectUsers,
  updatePassword,
} from "./utils/users";
import { selectUserDocuments, createDocument } from "./utils/documents";
import * as Y from "yjs";

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 6001;
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
  new LocalStrategy(async function (username, password, done) {
    const user = await validateUser({ name: username, password: password });
    if (!user) {
      return false;
    }
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

app.post("/login", passport.authenticate("local", { successRedirect: "/" }));

app.post("/user/update-password", async function (req, resp, next) {
  const result = await updatePassword(req.body);
  if (!result) {
    resp.send(401);
  }
  resp.redirect(302, "/");
});
app.post("/user/create-user", async function (req, resp, next) {
  const user = await createUser(req.body);
  if (!user) {
    resp.send(401);
  } else {
    resp.redirect(302, "/");
  }
});
app.get("/users", auth, async function (resp) {
  const users = await selectUsers();
  if (!users) {
    resp.send(404);
  } else {
    resp.send({
      user: users,
    });
  }
});
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

const server = http.createServer(app);

server.on("upgrade", upgradeWebsockets);

server.listen({ host, port });

console.log("Signaling server running on", host, ":", port);
