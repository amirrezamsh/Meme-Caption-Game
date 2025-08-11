// import express from "express";
// import UserController from "../controllers/userController";

const express = require("express");
const UserController = require("../controllers/userController");
const auth = require("./auth");
const createValidationMiddleware = require("../middlewares/validators");
const { body } = require("express-validator");

const { route } = require("./gameRoutes");

const router = express.Router();

// export default router;
module.exports = router;
