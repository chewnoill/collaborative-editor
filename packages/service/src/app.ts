import express from "express";
import passport from "./passport";
import bodyParser from "body-parser";
import { gqlMiddleware } from "./db";
import Session from "./session";
import path from "path";
import logger, { loggerMiddleware } from "./logger";
import { redirectForDownload } from "./resolvers/data-uploads";

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate(["bearer", "anonymous"]));

app.use(gqlMiddleware());

app.get("/health-check", (_, resp) => {
  resp.send("OK");
});

app.get("/img/:id", (req, resp) => redirectForDownload(req.params.id, resp));

app.post(
  "/api/login",
  passport.authenticate("local", {
    failureRedirect: "/failed-login",
    successRedirect: "/",
    session: true,
  })
);

export default app as any;
