// import express from "express";
// import GameController from "../controllers/gameController";

const express = require("express");
const GameController = require("../controllers/gameController");
const auth = require("./auth");
const createValidationMiddleware = require("../middlewares/validators");
const { body, param, query } = require("express-validator");

const router = express.Router();

// Route for retriving a random meme with seven captions (2 of them are correct and five incorrect)
router.post(
  "/meme",
  createValidationMiddleware(
    [body("memesUsed").optional().isArray().withMessage("Must be an array")],
    ["memesUsed"]
  ),
  (req, res, next) => {
    GameController.getMeme(req.body.memesUsed)
      .then((result) => {
        res.status(200).json({ status: "successful", data: result });
      })
      .catch((err) => {
        next(err);
      });
  }
);

// Route for retrieving correct captions for a a meme
router.get("/meme/:memeId/captions", (req, res, next) => {
  GameController.getCorrectCaptions(req.params.memeId)
    .then((result) => {
      res.status(200).json({
        status: "successful",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// Route for starting/recording a game (only allowed by logged in users)
router.post(
  "/start",
  auth.isLoggedIn,
  createValidationMiddleware([], []),
  (req, res, next) => {
    GameController.startGame(req.user.id)
      .then((result) => {
        res.status(201).json({
          status: "successful",
          gameId: result,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

// route for recording details about a round
router.post(
  "/round",
  auth.isLoggedIn,
  createValidationMiddleware(
    [
      body("gameId").isInt().withMessage("Game id must be integer"),
      body("memeId").isInt().withMessage("Meme id must be integer"),
      body("selectedCaptionId")
        .optional()
        .isInt()
        .withMessage("Caption id must be integer"),
    ],
    ["gameId", "memeId", "selectedCaptionId"]
  ),
  (req, res, next) => {
    GameController.submitRound(
      req.user.id,
      req.body.gameId,
      req.body.memeId,
      req.body.selectedCaptionId
    )
      .then((result) => {
        let response;
        if (result) {
          response = {
            correct: "true",
            score: 5,
            message: "Correct caption selected",
          };
        } else {
          response = {
            correct: "false",
            score: 0,
            message: "Wrong caption selected",
          };
        }
        res.status(201).json({
          status: "successful",
          data: response,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

// route for recording total score for a game and finishing that game
router.post("/end", (req, res, next) => {
  GameController.endGame();
});

// route for retrieving 10 games based on the offset given, if no offset is provided, it retrieves all games for the current logged in user
router.get(
  "/",
  auth.isLoggedIn,
  createValidationMiddleware(
    [query("offset").optional().isInt().withMessage("Offset must be Integer")],
    ["offset"]
  ),
  (req, res, next) => {
    GameController.getUserGames(req.user.id, req.query.offset)
      .then((result) => {
        res.status(200).json({
          status: "successful",
          data: result,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

// route for retirving informations about rounds of a single game (ensures that game belongs to current logged in user)
router.get(
  "/:gameId/rounds",
  auth.isLoggedIn,
  createValidationMiddleware(
    [param("gameId").isInt().withMessage("game id must be integer")],
    []
  ),
  (req, res, next) => {
    GameController.getUserRoundsByGame(req.params["gameId"], req.user.id)
      .then((result) => {
        res.status(200).json({
          status: "successful",
          data: result,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

// export default router;
module.exports = router;
