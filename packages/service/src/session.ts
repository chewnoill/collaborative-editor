import session from "express-session";
import pgSession from "connect-pg-simple";
import { pool } from "./db";

const SESSION_SECRET = process.env.SESSION_SECRET || "big secret";

const Session = session({
  store: new (pgSession(session))({
    pool,
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
});

export default Session;
