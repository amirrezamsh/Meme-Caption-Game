// import UserDAO from "../dao/userDAO";
// import bcrypt from "bcrypt";
// import passport from "passport";
const UserDAO = require("../dao/userDAO");
const bcrypt = require("bcrypt");
const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await UserDAO.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "incorrect username or password" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "incorrect username or password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserDAO.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// middleware for checking if user is logged in
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    status: "fail",
    message: "Unauthorized",
  });
};

// Login
exports.login = (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) reject(err);
      if (!user) reject(info);
      req.login(user, (err) => {
        if (err) reject(err);
        resolve(req.user);
      });
    })(req, res, next);
  });
};

// Logout
exports.logout = (req, res, next) => {
  return new Promise((resolve, reject) => {
    req.logout(() => resolve(null));
  });
};

// module.exports = router;
