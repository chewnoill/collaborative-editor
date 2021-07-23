import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "express-session";
import http from "http";
import upgradeWebsockets from "./websocket-service";
import { createUser } from "./utils/users";
import { selectUserDocuments } from "./utils/documents";

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 6001;
const SESSION_SECRET = process.env.SESSION_SECRET || "big secret";

const app = express();

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

app.post("/login", passport.authenticate("local", { successRedirect: "/" }));

app.post("/document", function (req, resp) {
  resp.send({ user: req.user });
});
app.get("/documents", async function (req, resp) {
  if (!req.user) {
    resp.status(401);
    resp.send("need to login");
    return;
  }
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
