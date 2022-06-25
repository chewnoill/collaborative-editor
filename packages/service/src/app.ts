import express from "express";
import passport from "./utils/passport";
import bodyParser from "body-parser";
import { gqlMiddleware } from "./db";
import Session from "./session";
import path from "path";
import { loggerMiddleware } from "./logger";

const app = express();

app.use(loggerMiddleware);

app.use(function (req, _res, next) {
  if (req.url.startsWith("/document/")) {
    req.url = "/document/[id]/";
  }
  next();
});

const STATIC_PATH = path.resolve(__dirname, "../../client/out");

app.use("/", express.static(STATIC_PATH));

app.use(Session);

const auth = (req, resp, next) => {
  if (!req.user) {
    resp.status(401);
    next(new Error("need to login"));
  } else {
    next();
  }
};

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

export default app as any;
