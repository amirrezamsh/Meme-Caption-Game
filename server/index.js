const express = require("express");

const GameRoutes = require("./routers/gameRoutes");
const UserRoutes = require("./routers/userRoutes");
const AuthRoutes = require("./routers/authRoutes");
const GlobalErrorHandler = require("./middlewares/errorController");

const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
require("./routers/auth");

// Load environment variables from .env file
dotenv.config({ path: "./config.env" });

// init express
const app = new express();
const port = 3001;

// cors
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // Allow cookies and authentication headers
};

// Use CORS middleware with options
app.use(cors(corsOptions));
// app.use(cors());

// Session setup
app.use(
  session({
    secret: process.env.SECRETKEY,
    resave: false,
    saveUninitialized: false,
  })
);
// Initialize Passport and use session middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(morgan("dev"));

//Middlewares (routes)
app.use("/games", GameRoutes);
app.use("/user", UserRoutes);
app.use("/auth", AuthRoutes);
app.all("*", (req, res, next) => {
  const err = new Error(`Could not find ${req.originalUrl} on this server`);
  err.statusCode = 404;
  next(err);
});

app.use(GlobalErrorHandler);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
