import session from "express-session";

const SESSION_SECRET = process.env.SESSION_SECRET || "big secret";

const Session = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
});

export default Session;
