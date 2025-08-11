// import express from "express";
// import auth from "./auth";
const express = require("express");
const auth = require("./auth");
router = express.Router();

const UserController = require("../controllers/userController");
const createValidationMiddleware = require("../middlewares/validators");
const { body } = require("express-validator");

//route fot signup
router.post(
  "/signup",
  createValidationMiddleware(
    [
      body("username").isString().withMessage("Username must be a string"),
      body("password").isString().withMessage("Password must be a string"),
    ],
    ["username", "password"]
  ),
  (req, res, next) => {
    UserController.createUser(req, res)
      .then((result) => {
        res.status(201).json({
          status: "successful",
          message: "Account has been created successfully",
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

//route for login
router.post(
  "/login",
  createValidationMiddleware(
    [
      body("username").isString().withMessage("Username must be a string"),
      body("password").isString().withMessage("Password must be a string"),
    ],
    ["username", "password"]
  ),
  (req, res, next) => {
    auth
      .login(req, res, next)
      .then((user) => {
        res.status(200).json({
          status: "successful",
          User: {
            id: user.id,
            username: user.username,
          },
        });
      })
      .catch((err) => {
        if (err.message == "incorrect username or password") {
          err.statusCode = 401;
        } else if (err.message == "Missing credentials") {
          err.statusCode = 400;
        }
        next(err);
      });
  }
);

// route for logging out
router.post(
  "/logout",
  auth.isLoggedIn,
  createValidationMiddleware([], []),
  (req, res, next) => {
    auth.logout(req, res, next).then((result) => {
      res.status(200).json({
        status: "successful",
      });
    });
  }
);

module.exports = router;
